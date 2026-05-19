using GearVault.Application.Common.User;
using GearVault.Application.DTOs.PartFailurePredictions;
using GearVault.Application.Exceptions;
using GearVault.Application.Interfaces.Repositories;
using GearVault.Application.Interfaces.Services;
using GearVault.Domain.Common;
using GearVault.Domain.Common.Enum;
using GearVault.Domain.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.ML;
using Microsoft.ML.Data;

namespace GearVault.Infrastructure.Implementation.Services;

public class PartFailurePredictionService(
    IGenericRepository genericRepository,
    IApplicationUserService applicationUserService,
    IWebHostEnvironment webHostEnvironment) : IPartFailurePredictionService
{
    private const string DatasetRelativePath = "datasets/ai4i2020.csv";

    private static readonly object ModelLock = new();
    private static PredictionEngine<Ai4iPredictionInput, Ai4iPredictionOutput>? PredictionEngine;

    #region AI Prediction Generation
    /// <summary>
    /// Generates and stores an ML.NET vehicle health prediction for a vehicle, then alerts admins for high-risk results.
    /// </summary>
    public PartFailurePredictionDto GeneratePrediction(Guid vehicleId, CreatePartFailurePredictionDto dto)
    {
        var vehicle = GetAllowedVehicle(vehicleId);

        var predictionInput = BuildPrediction(vehicle, dto);
        var matchedPart = FindMatchingPart(predictionInput.PredictedPartName);

        var prediction = new PartFailurePrediction(
            vehicle.Id,
            matchedPart?.Id,
            predictionInput.PredictedPartName,
            predictionInput.ConditionSummary,
            predictionInput.UsagePatternSummary,
            predictionInput.RiskScore,
            predictionInput.Severity,
            predictionInput.PredictedFailureDate,
            predictionInput.Recommendation);

        var predictionId = genericRepository.Insert(prediction);

        if (predictionInput.Severity is PredictionSeverity.High or PredictionSeverity.Critical)
        {
            var notification = new AdminNotification(
                AdminNotificationType.AiFailurePrediction,
                "AI vehicle health alert",
                $"{vehicle.VehicleNumber}: {predictionInput.PredictedPartName} risk is {predictionInput.Severity} ({predictionInput.RiskScore:N0}%).",
                partId: matchedPart?.Id,
                userId: vehicle.UserId,
                partFailurePredictionId: predictionId);

            genericRepository.Insert(notification);
        }

        var savedPrediction = genericRepository.GetById<PartFailurePrediction>(
            predictionId,
            asNoTracking: true,
            includeProperties: "Vehicle,Vehicle.User,Part")!;

        return savedPrediction.ToPartFailurePredictionDto();
    }
    #endregion

    #region AI Prediction Retrieval and Acknowledgement
    /// <summary>
    /// Retrieves all AI vehicle health predictions for the currently logged-in customer.
    /// </summary>
    public List<PartFailurePredictionDto> GetMyPredictions()
    {
        var userId = applicationUserService.GetUserId;

        var predictions = genericRepository.Get<PartFailurePrediction>(
            x => x.Vehicle!.UserId == userId,
            orderBys: new[] { "GeneratedAt desc" },
            asNoTracking: true,
            includeProperties: "Vehicle,Vehicle.User,Part").ToList();

        return predictions.ConvertAll(x => x.ToPartFailurePredictionDto());
    }

    /// <summary>
    /// Retrieves AI vehicle health predictions for a selected vehicle after validating access.
    /// </summary>
    public List<PartFailurePredictionDto> GetPredictionsByVehicle(Guid vehicleId)
    {
        _ = GetAllowedVehicle(vehicleId);

        var predictions = genericRepository.Get<PartFailurePrediction>(
            x => x.VehicleId == vehicleId,
            orderBys: new[] { "GeneratedAt desc" },
            asNoTracking: true,
            includeProperties: "Vehicle,Vehicle.User,Part").ToList();

        return predictions.ConvertAll(x => x.ToPartFailurePredictionDto());
    }

    /// <summary>
    /// Marks a generated AI prediction as acknowledged after checking vehicle access.
    /// </summary>
    public void AcknowledgePrediction(Guid predictionId)
    {
        var prediction = genericRepository.GetById<PartFailurePrediction>(
            predictionId,
            includeProperties: "Vehicle")
            ?? throw new NotFoundException("AI vehicle health prediction not found.");

        EnsureVehicleAccess(prediction.Vehicle ?? throw new NotFoundException("Vehicle not found."));

        prediction.Acknowledge();
        genericRepository.Update(prediction);
    }
    #endregion

    #region Vehicle Access Guard
    private Vehicle GetAllowedVehicle(Guid vehicleId)
    {
        var vehicle = genericRepository.GetById<Vehicle>(vehicleId, includeProperties: "User")
            ?? throw new NotFoundException("Vehicle not found.");

        EnsureVehicleAccess(vehicle);

        return vehicle;
    }

    private void EnsureVehicleAccess(Vehicle vehicle)
    {
        if (applicationUserService.IsInRole(Constants.Roles.Administrator.Name) ||
            applicationUserService.IsInRole(Constants.Roles.Staff.Name))
            return;

        if (vehicle.UserId != applicationUserService.GetUserId)
            throw new NotFoundException("Vehicle not found.");
    }
    #endregion

    #region ML.NET Prediction Pipeline
    private PredictionInput BuildPrediction(Vehicle vehicle, CreatePartFailurePredictionDto dto)
    {
        var vehicleAge = Math.Max(0, DateTime.Now.Year - vehicle.Year);
        var mileage = Math.Max(0, dto.CurrentMileage ?? vehicleAge * 12000);
        var averageDailyKm = Math.Max(0, dto.AverageDailyKilometers ?? 25);
        var notes = dto.ConditionNotes?.Trim() ?? string.Empty;
        var usagePattern = dto.UsagePattern?.Trim() ?? "Mixed city and highway usage";
        var daysSinceService = dto.LastServiceDate.HasValue
            ? Math.Max(0, (DateTime.Now.Date - dto.LastServiceDate.Value.Date).Days)
            : vehicleAge * 120;

        var invoiceCount = genericRepository.GetCount<SalesInvoice>(x => x.VehicleId == vehicle.Id);
        var appointmentCount = genericRepository.GetCount<Appointment>(x => x.VehicleId == vehicle.Id);
        var mlInput = BuildModelInput(vehicle, mileage, averageDailyKm, daysSinceService, invoiceCount, appointmentCount, notes);
        var mlOutput = GetPredictionEngine().Predict(mlInput);
        var failureType = string.IsNullOrWhiteSpace(mlOutput.PredictedFailureType)
            ? "NoFailure"
            : mlOutput.PredictedFailureType;

        var confidence = mlOutput.Score is { Length: > 0 }
            ? Math.Clamp((decimal)mlOutput.Score.Max() * 100m, 0, 100)
            : 50m;

        var riskScore = failureType == "NoFailure"
            ? Math.Clamp(100m - confidence, 5, 35)
            : Math.Clamp(confidence, 35, 100);

        var predictedPartName = MapFailureTypeToPart(failureType, vehicle.FuelType);
        var severity = ToSeverity(riskScore);
        var predictedFailureDate = DateTime.Now.Date.AddDays(Math.Max(7, 130 - (int)Math.Round(riskScore)));

        var conditionSummary = string.IsNullOrWhiteSpace(notes)
            ? $"{vehicle.Make} {vehicle.Model} is evaluated from age, mileage, service gap, and recorded system history."
            : notes;

        var usageSummary = $"{usagePattern}. Estimated mileage: {mileage:N0} km, average daily use: {averageDailyKm:N1} km, last service gap: {daysSinceService} days. ML.NET model output: {failureType} ({confidence:N1}% confidence).";
        var recommendation = BuildRecommendation(predictedPartName, severity, predictedFailureDate);

        return new PredictionInput(
            predictedPartName,
            conditionSummary,
            usageSummary,
            riskScore,
            severity,
            predictedFailureDate,
            recommendation);
    }

    private Ai4iPredictionInput BuildModelInput(
        Vehicle vehicle,
        int mileage,
        decimal averageDailyKm,
        int daysSinceService,
        int invoiceCount,
        int appointmentCount,
        string notes)
    {
        var lowerNotes = notes.ToLower();
        var stressScore = Math.Min(1m,
            (mileage / 180000m) +
            (averageDailyKm / 220m) +
            (daysSinceService / 900m) +
            (invoiceCount * 0.015m) +
            (appointmentCount * 0.012m));

        var heatSymptoms = ContainsAny(lowerNotes, "overheating", "heat", "smoke");
        var powerSymptoms = ContainsAny(lowerNotes, "battery", "warning", "start", "electric", "light");
        var wearSymptoms = ContainsAny(lowerNotes, "wear", "tyre", "tire", "brake", "squeak", "vibration", "grip");
        var processTemperature = 308f + (float)(stressScore * 12m) + (heatSymptoms ? 4.5f : 0f);
        var airTemperature = processTemperature - (heatSymptoms ? 7.5f : 10.4f);
        var rotationalSpeed = 1550f - (float)(stressScore * 300m) - (wearSymptoms ? 70f : 0f);
        var torque = 39f + (float)(stressScore * 24m) + (powerSymptoms ? 12f : 0f);
        var toolWear = Math.Clamp(
            (float)(mileage / 650m + daysSinceService / 5m + invoiceCount * 4 + appointmentCount * 3 + (wearSymptoms ? 45 : 0)),
            0,
            260);

        return new Ai4iPredictionInput
        {
            Type = vehicle.FuelType == FuelType.Electric ? "H" : averageDailyKm > 70 ? "M" : "L",
            AirTemperature = airTemperature,
            ProcessTemperature = processTemperature,
            RotationalSpeed = rotationalSpeed,
            Torque = torque,
            ToolWear = toolWear
        };
    }

    private PredictionEngine<Ai4iPredictionInput, Ai4iPredictionOutput> GetPredictionEngine()
    {
        if (PredictionEngine != null) return PredictionEngine;

        lock (ModelLock)
        {
            if (PredictionEngine != null) return PredictionEngine;

            var datasetPath = Path.Combine(webHostEnvironment.WebRootPath, DatasetRelativePath);
            if (!File.Exists(datasetPath))
                throw new NotFoundException("AI predictive maintenance dataset was not found.");

            var mlContext = new MLContext(seed: 42);
            var data = mlContext.Data.LoadFromTextFile<Ai4iDatasetRow>(
                datasetPath,
                hasHeader: true,
                separatorChar: ',');

            var mappedData = mlContext.Data.CreateEnumerable<Ai4iDatasetRow>(data, reuseRowObject: false)
                .Select(row => new Ai4iTrainingRow
                {
                    Type = row.Type,
                    AirTemperature = row.AirTemperature,
                    ProcessTemperature = row.ProcessTemperature,
                    RotationalSpeed = row.RotationalSpeed,
                    Torque = row.Torque,
                    ToolWear = row.ToolWear,
                    FailureType = GetFailureType(row)
                });

            var trainingData = mlContext.Data.LoadFromEnumerable(mappedData);
            var pipeline = mlContext.Transforms.Conversion.MapValueToKey("Label", nameof(Ai4iTrainingRow.FailureType))
                .Append(mlContext.Transforms.Categorical.OneHotEncoding("TypeEncoded", nameof(Ai4iTrainingRow.Type)))
                .Append(mlContext.Transforms.Concatenate(
                    "Features",
                    "TypeEncoded",
                    nameof(Ai4iTrainingRow.AirTemperature),
                    nameof(Ai4iTrainingRow.ProcessTemperature),
                    nameof(Ai4iTrainingRow.RotationalSpeed),
                    nameof(Ai4iTrainingRow.Torque),
                    nameof(Ai4iTrainingRow.ToolWear)))
                .Append(mlContext.MulticlassClassification.Trainers.SdcaMaximumEntropy("Label", "Features"))
                .Append(mlContext.Transforms.Conversion.MapKeyToValue(
                    nameof(Ai4iPredictionOutput.PredictedFailureType),
                    "PredictedLabel"));

            var model = pipeline.Fit(trainingData);
            PredictionEngine = mlContext.Model.CreatePredictionEngine<Ai4iPredictionInput, Ai4iPredictionOutput>(model);

            return PredictionEngine;
        }
    }
    #endregion

    #region Mapping and Recommendation Helpers
    private static string GetFailureType(Ai4iDatasetRow row)
    {
        if (row.ToolWearFailure == 1) return "ToolWearFailure";
        if (row.HeatDissipationFailure == 1) return "HeatDissipationFailure";
        if (row.PowerFailure == 1) return "PowerFailure";
        if (row.OverstrainFailure == 1) return "OverstrainFailure";
        if (row.RandomFailure == 1) return "RandomFailure";
        return "NoFailure";
    }

    private static string MapFailureTypeToPart(string failureType, FuelType fuelType)
    {
        return failureType switch
        {
            "ToolWearFailure" => "Brake Pads",
            "HeatDissipationFailure" => fuelType == FuelType.Electric ? "EV Battery Cooling Component" : "Radiator Cooling Component",
            "PowerFailure" => "Battery",
            "OverstrainFailure" => "Clutch Assembly",
            "RandomFailure" => "Engine Oil Filter",
            _ => "General Maintenance Inspection"
        };
    }

    private Part? FindMatchingPart(string predictedPartName)
    {
        var terms = predictedPartName
            .ToLower()
            .Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        return genericRepository.Get<Part>(
                x => x.IsActive &&
                     terms.Any(term =>
                         x.Name.ToLower().Contains(term) ||
                         (x.Category != null && x.Category.ToLower().Contains(term))),
                asNoTracking: true)
            .OrderByDescending(x => x.StockQuantity)
            .FirstOrDefault();
    }

    private static PredictionSeverity ToSeverity(decimal riskScore)
    {
        if (riskScore >= 85) return PredictionSeverity.Critical;
        if (riskScore >= 65) return PredictionSeverity.High;
        if (riskScore >= 40) return PredictionSeverity.Medium;
        return PredictionSeverity.Low;
    }

    private static string BuildRecommendation(string partName, PredictionSeverity severity, DateTime predictedFailureDate)
    {
        var action = severity switch
        {
            PredictionSeverity.Critical => "Book service immediately and avoid long trips until inspection.",
            PredictionSeverity.High => "Schedule preventive service soon to avoid failure.",
            PredictionSeverity.Medium => "Monitor symptoms and plan inspection during the next service visit.",
            _ => "No urgent action needed; keep regular maintenance checks."
        };

        return $"{partName} shows {severity} risk. Predicted attention date: {predictedFailureDate:dd MMM yyyy}. {action}";
    }

    private static bool ContainsAny(string source, params string[] terms)
    {
        return terms.Any(source.Contains);
    }
    #endregion

    #region ML.NET Data Contracts
    private sealed record PredictionInput(
        string PredictedPartName,
        string ConditionSummary,
        string UsagePatternSummary,
        decimal RiskScore,
        PredictionSeverity Severity,
        DateTime PredictedFailureDate,
        string Recommendation);

    private sealed class Ai4iDatasetRow
    {
        [LoadColumn(2)]
        public string Type { get; set; } = string.Empty;

        [LoadColumn(3)]
        public float AirTemperature { get; set; }

        [LoadColumn(4)]
        public float ProcessTemperature { get; set; }

        [LoadColumn(5)]
        public float RotationalSpeed { get; set; }

        [LoadColumn(6)]
        public float Torque { get; set; }

        [LoadColumn(7)]
        public float ToolWear { get; set; }

        [LoadColumn(9)]
        public float ToolWearFailure { get; set; }

        [LoadColumn(10)]
        public float HeatDissipationFailure { get; set; }

        [LoadColumn(11)]
        public float PowerFailure { get; set; }

        [LoadColumn(12)]
        public float OverstrainFailure { get; set; }

        [LoadColumn(13)]
        public float RandomFailure { get; set; }
    }

    private sealed class Ai4iTrainingRow
    {
        public string Type { get; set; } = string.Empty;
        public float AirTemperature { get; set; }
        public float ProcessTemperature { get; set; }
        public float RotationalSpeed { get; set; }
        public float Torque { get; set; }
        public float ToolWear { get; set; }
        public string FailureType { get; set; } = string.Empty;
    }

    private sealed class Ai4iPredictionInput
    {
        public string Type { get; set; } = string.Empty;
        public float AirTemperature { get; set; }
        public float ProcessTemperature { get; set; }
        public float RotationalSpeed { get; set; }
        public float Torque { get; set; }
        public float ToolWear { get; set; }
    }

    private sealed class Ai4iPredictionOutput
    {
        [ColumnName("PredictedFailureType")]
        public string PredictedFailureType { get; set; } = string.Empty;

        public float[] Score { get; set; } = [];
    }
    #endregion
}

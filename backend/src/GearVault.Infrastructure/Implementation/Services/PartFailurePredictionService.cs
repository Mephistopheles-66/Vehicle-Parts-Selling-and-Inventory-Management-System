using GearVault.Application.Common.User;
using GearVault.Application.DTOs.PartFailurePredictions;
using GearVault.Application.Exceptions;
using GearVault.Application.Interfaces.Repositories;
using GearVault.Application.Interfaces.Services;
using GearVault.Domain.Common;
using GearVault.Domain.Common.Enum;
using GearVault.Domain.Entities;

namespace GearVault.Infrastructure.Implementation.Services;

public class PartFailurePredictionService(
    IGenericRepository genericRepository,
    IApplicationUserService applicationUserService) : IPartFailurePredictionService
{
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
        var lowerNotes = notes.ToLower();

        var candidates = new List<PredictionCandidate>
        {
            ScoreCandidate("Brake Pads", 18, mileage, averageDailyKm, daysSinceService, invoiceCount, appointmentCount, lowerNotes, "brake", "squeak", "vibration"),
            ScoreCandidate("Battery", 14, mileage, averageDailyKm, daysSinceService, invoiceCount, appointmentCount, lowerNotes, "battery", "start", "electric", "light"),
            ScoreCandidate("Engine Oil Filter", 16, mileage, averageDailyKm, daysSinceService, invoiceCount, appointmentCount, lowerNotes, "oil", "filter", "engine", "smoke"),
            ScoreCandidate("Air Filter", 10, mileage, averageDailyKm, daysSinceService, invoiceCount, appointmentCount, lowerNotes, "air", "dust", "mileage", "pickup"),
            ScoreCandidate("Tyres", 12, mileage, averageDailyKm, daysSinceService, invoiceCount, appointmentCount, lowerNotes, "tyre", "tire", "grip", "wear")
        };

        if (vehicle.FuelType == FuelType.Electric)
        {
            candidates.Add(ScoreCandidate("EV Battery Cooling Component", 20, mileage, averageDailyKm, daysSinceService, invoiceCount, appointmentCount, lowerNotes, "heat", "battery", "range", "charging"));
        }
        else
        {
            candidates.Add(ScoreCandidate("Fuel Filter", 12, mileage, averageDailyKm, daysSinceService, invoiceCount, appointmentCount, lowerNotes, "fuel", "diesel", "petrol", "gas"));
        }

        var best = candidates.OrderByDescending(x => x.RiskScore).First();
        var severity = ToSeverity(best.RiskScore);
        var predictedFailureDate = DateTime.Now.Date.AddDays(Math.Max(7, 130 - (int)Math.Round(best.RiskScore)));

        var conditionSummary = string.IsNullOrWhiteSpace(notes)
            ? $"{vehicle.Make} {vehicle.Model} is evaluated from age, mileage, service gap, and recorded system history."
            : notes;

        var usageSummary = $"{usagePattern}. Estimated mileage: {mileage:N0} km, average daily use: {averageDailyKm:N1} km, last service gap: {daysSinceService} days.";
        var recommendation = BuildRecommendation(best.PredictedPartName, severity, predictedFailureDate);

        return new PredictionInput(
            best.PredictedPartName,
            conditionSummary,
            usageSummary,
            best.RiskScore,
            severity,
            predictedFailureDate,
            recommendation);
    }

    private static PredictionCandidate ScoreCandidate(
        string partName,
        decimal baseScore,
        int mileage,
        decimal averageDailyKm,
        int daysSinceService,
        int invoiceCount,
        int appointmentCount,
        string notes,
        params string[] keywords)
    {
        var score = baseScore;
        score += Math.Min(30, mileage / 3500m);
        score += Math.Min(18, averageDailyKm / 3m);
        score += Math.Min(22, daysSinceService / 18m);
        score += Math.Min(8, invoiceCount * 1.5m);
        score += Math.Min(7, appointmentCount * 1.25m);
        score += keywords.Any(notes.Contains) ? 24 : 0;

        return new PredictionCandidate(partName, Math.Clamp(Math.Round(score, 2), 0, 100));
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

    private sealed record PredictionCandidate(string PredictedPartName, decimal RiskScore);

    private sealed record PredictionInput(
        string PredictedPartName,
        string ConditionSummary,
        string UsagePatternSummary,
        decimal RiskScore,
        PredictionSeverity Severity,
        DateTime PredictedFailureDate,
        string Recommendation);
}

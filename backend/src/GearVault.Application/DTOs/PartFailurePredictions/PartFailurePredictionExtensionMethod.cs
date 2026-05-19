using GearVault.Application.DTOs.Parts;
using GearVault.Application.DTOs.Vehicles;
using GearVault.Domain.Entities;

namespace GearVault.Application.DTOs.PartFailurePredictions;

public static class PartFailurePredictionExtensionMethod
{
    public static PartFailurePredictionDto ToPartFailurePredictionDto(this PartFailurePrediction prediction)
    {
        return new PartFailurePredictionDto
        {
            Id = prediction.Id,
            Vehicle = prediction.Vehicle?.ToVehicleDto() ?? new(),
            Part = prediction.Part?.ToPartDto(),
            PredictedPartName = prediction.PredictedPartName,
            ConditionSummary = prediction.ConditionSummary,
            UsagePatternSummary = prediction.UsagePatternSummary,
            RiskScore = prediction.RiskScore,
            Severity = prediction.Severity.ToString(),
            PredictedFailureDate = prediction.PredictedFailureDate,
            Recommendation = prediction.Recommendation,
            GeneratedAt = prediction.GeneratedAt,
            IsAcknowledged = prediction.IsAcknowledged,
            AcknowledgedAt = prediction.AcknowledgedAt
        };
    }
}

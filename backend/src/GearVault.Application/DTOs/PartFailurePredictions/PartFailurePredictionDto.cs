using GearVault.Application.DTOs.Parts;
using GearVault.Application.DTOs.Vehicles;

namespace GearVault.Application.DTOs.PartFailurePredictions;

public class PartFailurePredictionDto
{
    public Guid Id { get; set; }
    public VehicleDto Vehicle { get; set; } = new();
    public PartDto? Part { get; set; }
    public string PredictedPartName { get; set; } = string.Empty;
    public string ConditionSummary { get; set; } = string.Empty;
    public string UsagePatternSummary { get; set; } = string.Empty;
    public decimal RiskScore { get; set; }
    public string Severity { get; set; } = string.Empty;
    public DateTime? PredictedFailureDate { get; set; }
    public string Recommendation { get; set; } = string.Empty;
    public DateTime GeneratedAt { get; set; }
    public bool IsAcknowledged { get; set; }
    public DateTime? AcknowledgedAt { get; set; }
}

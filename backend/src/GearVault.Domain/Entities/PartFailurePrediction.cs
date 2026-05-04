using GearVault.Domain.Common.Base;
using GearVault.Domain.Common.Enum;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearVault.Domain.Entities;

public class PartFailurePrediction(
    Guid vehicleId,
    Guid? partId,
    string predictedPartName,
    string conditionSummary,
    string usagePatternSummary,
    decimal riskScore,
    PredictionSeverity severity,
    DateTime? predictedFailureDate,
    string recommendation
) : AuditableEntity<Guid>
{
    [ForeignKey(nameof(Vehicle))]
    public Guid VehicleId { get; private set; } = vehicleId;

    [ForeignKey(nameof(Part))]
    public Guid? PartId { get; private set; } = partId;

    public string PredictedPartName { get; private set; } = predictedPartName;

    public string ConditionSummary { get; private set; } = conditionSummary;

    public string UsagePatternSummary { get; private set; } = usagePatternSummary;

    public decimal RiskScore { get; private set; } = riskScore;

    public PredictionSeverity Severity { get; private set; } = severity;

    public DateTime? PredictedFailureDate { get; private set; } = predictedFailureDate;

    public string Recommendation { get; private set; } = recommendation;

    public DateTime GeneratedAt { get; private set; } = DateTime.Now;

    public bool IsAcknowledged { get; private set; }

    public DateTime? AcknowledgedAt { get; private set; }

    public virtual Vehicle? Vehicle { get; set; }

    public virtual Part? Part { get; set; }

    public void Acknowledge()
    {
        IsAcknowledged = true;
        AcknowledgedAt = DateTime.Now;
    }
}

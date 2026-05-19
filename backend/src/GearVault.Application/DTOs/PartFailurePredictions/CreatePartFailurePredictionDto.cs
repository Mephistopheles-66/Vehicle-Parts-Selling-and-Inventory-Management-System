namespace GearVault.Application.DTOs.PartFailurePredictions;

public class CreatePartFailurePredictionDto
{
    public int? CurrentMileage { get; set; }
    public decimal? AverageDailyKilometers { get; set; }
    public DateTime? LastServiceDate { get; set; }
    public string? ConditionNotes { get; set; }
    public string? UsagePattern { get; set; }
}

namespace GearVault.Application.DTOs.Reviews;

public class CreateReviewDto
{
    public Guid AppointmentId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
}

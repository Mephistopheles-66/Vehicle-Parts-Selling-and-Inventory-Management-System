namespace GearVault.Application.DTOs.Appointments;

public class AppointmentDto
{
    public Guid Id { get; set; }
    public Guid VehicleId { get; set; }
    public Guid CustomerUserId { get; set; }
    public DateTime ScheduledAt { get; set; }
    public string? Notes { get; set; }
    public string Status { get; set; } = string.Empty;
    public string VehiclePlateNumber { get; set; } = string.Empty;
    public string VehicleMake { get; set; } = string.Empty;
    public string VehicleModel { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

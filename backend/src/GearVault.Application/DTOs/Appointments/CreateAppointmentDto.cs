namespace GearVault.Application.DTOs.Appointments;

public class CreateAppointmentDto
{
    public Guid VehicleId { get; set; }
    public DateTime ScheduledAt { get; set; }
    public string? Notes { get; set; }
}

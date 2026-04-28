using GearVault.Domain.Entities;

namespace GearVault.Application.DTOs.Appointments;

public static class AppointmentExtensionMethod
{
    public static AppointmentDto ToAppointmentDto(this Appointment appointment)
    {
        return new AppointmentDto
        {
            Id = appointment.Id,
            VehicleId = appointment.VehicleId,
            CustomerUserId = appointment.CustomerUserId,
            ScheduledAt = appointment.ScheduledAt,
            Notes = appointment.Notes,
            Status = appointment.Status.ToString().ToUpper(),
            VehiclePlateNumber = appointment.Vehicle?.PlateNumber ?? string.Empty,
            VehicleMake = appointment.Vehicle?.Make ?? string.Empty,
            VehicleModel = appointment.Vehicle?.Model ?? string.Empty,
            IsActive = appointment.IsActive,
            CreatedAt = appointment.CreatedAt,
            UpdatedAt = appointment.UpdatedAt
        };
    }
}

using GearVault.Domain.Common.Base;
using GearVault.Domain.Common.Enum;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearVault.Domain.Entities;

public class Appointment(
    Guid vehicleId,
    Guid customerUserId,
    DateTime scheduledAt,
    string? notes
) : BaseEntity<Guid>
{
    [ForeignKey(nameof(Vehicle))]
    public Guid VehicleId { get; private set; } = vehicleId;

    [ForeignKey(nameof(Customer))]
    public Guid CustomerUserId { get; private set; } = customerUserId;

    public DateTime ScheduledAt { get; private set; } = scheduledAt;

    public string? Notes { get; private set; } = notes;

    public AppointmentStatus Status { get; private set; } = AppointmentStatus.Pending;

    public DateTime UpdatedAt { get; private set; } = DateTime.Now;

    public virtual Vehicle? Vehicle { get; set; }

    public virtual User? Customer { get; set; }

    public virtual Review? Review { get; set; }

    public void Reschedule(DateTime scheduledAt, string? notes)
    {
        ScheduledAt = scheduledAt;
        Notes = notes;
        UpdatedAt = DateTime.Now;
    }

    public void Cancel()
    {
        Status = AppointmentStatus.Cancelled;
        UpdatedAt = DateTime.Now;
    }

    public void Confirm()
    {
        Status = AppointmentStatus.Confirmed;
        UpdatedAt = DateTime.Now;
    }

    public void Complete()
    {
        Status = AppointmentStatus.Completed;
        UpdatedAt = DateTime.Now;
    }
}

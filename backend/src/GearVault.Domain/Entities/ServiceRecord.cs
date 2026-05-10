using GearVault.Domain.Common.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearVault.Domain.Entities;

public class ServiceRecord(
    Guid serviceAppointmentId,
    DateTime serviceDate,
    int? odometerReading,
    string workDescription,
    string? technicianNotes,
    decimal totalCost
) : AuditableEntity<Guid>
{
    [ForeignKey(nameof(ServiceAppointment))]
    public Guid ServiceAppointmentId { get; private set; } = serviceAppointmentId;

    public DateTime ServiceDate { get; private set; } = serviceDate;

    public int? OdometerReading { get; private set; } = odometerReading;

    public string WorkDescription { get; private set; } = workDescription;

    public string? TechnicianNotes { get; private set; } = technicianNotes;

    public decimal TotalCost { get; private set; } = totalCost;

    public virtual ServiceAppointment? ServiceAppointment { get; set; }
}

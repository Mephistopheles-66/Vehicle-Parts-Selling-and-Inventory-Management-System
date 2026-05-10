using GearVault.Domain.Common.Base;
using GearVault.Domain.Common.Enum;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearVault.Domain.Entities;

public class ServiceAppointment(
    Guid vehicleId,
    DateTime appointmentDate,
    string serviceType,
    string? issueDescription,
    string? notes
) : AuditableEntity<Guid>
{
    [ForeignKey(nameof(Vehicle))]
    public Guid VehicleId { get; private set; } = vehicleId;

    [ForeignKey(nameof(AssignedStaff))]
    public Guid? AssignedStaffId { get; private set; }

    public DateTime AppointmentDate { get; private set; } = appointmentDate;

    public string ServiceType { get; private set; } = serviceType;

    public string? IssueDescription { get; private set; } = issueDescription;

    public string? Notes { get; private set; } = notes;

    public AppointmentStatus Status { get; private set; } = AppointmentStatus.Pending;

    public DateTime UpdatedAt { get; private set; } = DateTime.Now;

    public virtual Vehicle? Vehicle { get; set; }

    public virtual User? AssignedStaff { get; set; }

    public virtual ICollection<ServiceReview>? Reviews { get; set; }

    public virtual ServiceRecord? ServiceRecord { get; set; }

    public void Update(DateTime appointmentDate, string serviceType, string? issueDescription, string? notes)
    {
        AppointmentDate = appointmentDate;
        ServiceType = serviceType;
        IssueDescription = issueDescription;
        Notes = notes;
        UpdatedAt = DateTime.Now;
    }

    public void AssignStaff(Guid staffId)
    {
        AssignedStaffId = staffId;
        UpdatedAt = DateTime.Now;
    }

    public void ChangeStatus(AppointmentStatus status)
    {
        Status = status;
        UpdatedAt = DateTime.Now;
    }
}

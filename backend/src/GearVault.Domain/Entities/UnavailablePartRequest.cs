using GearVault.Domain.Common.Base;
using GearVault.Domain.Common.Enum;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearVault.Domain.Entities;

public class UnavailablePartRequest(
    Guid vehicleId,
    string requestedPartName,
    string? description,
    int quantity
) : AuditableEntity<Guid>
{
    [ForeignKey(nameof(Vehicle))]
    public Guid VehicleId { get; private set; } = vehicleId;

    public string RequestedPartName { get; private set; } = requestedPartName;

    public string? Description { get; private set; } = description;

    public int Quantity { get; private set; } = quantity;

    public PartRequestStatus Status { get; private set; } = PartRequestStatus.Pending;

    public DateTime RequestedAt { get; private set; } = DateTime.Now;

    public DateTime? FulfilledAt { get; private set; }

    public virtual Vehicle? Vehicle { get; set; }

    public void ChangeStatus(PartRequestStatus status)
    {
        Status = status;
        if (status == PartRequestStatus.Fulfilled) FulfilledAt = DateTime.Now;
    }
}

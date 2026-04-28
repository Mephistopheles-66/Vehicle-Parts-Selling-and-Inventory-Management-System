using GearVault.Domain.Common.Base;
using GearVault.Domain.Common.Enum;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearVault.Domain.Entities;

public class PartRequest(
    Guid customerUserId,
    string partName,
    string? description
) : BaseEntity<Guid>
{
    [ForeignKey(nameof(Customer))]
    public Guid CustomerUserId { get; private set; } = customerUserId;

    public string PartName { get; private set; } = partName;

    public string? Description { get; private set; } = description;

    public PartRequestStatus Status { get; private set; } = PartRequestStatus.Pending;

    public DateTime UpdatedAt { get; private set; } = DateTime.Now;

    public virtual User? Customer { get; set; }

    public void Update(string partName, string? description, bool isActive)
    {
        PartName = partName;
        Description = description;
        IsActive = isActive;
        UpdatedAt = DateTime.Now;
    }

    public void UpdateStatus(PartRequestStatus status)
    {
        Status = status;
        UpdatedAt = DateTime.Now;
    }
}

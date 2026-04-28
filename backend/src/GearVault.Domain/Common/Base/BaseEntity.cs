using System.ComponentModel.DataAnnotations;

namespace GearVault.Domain.Common.Base;

public class BaseEntity<TPrimaryKey>
{
    [Key]
    public TPrimaryKey Id { get; private set; } = default!;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public void ActivateDeactivateEntity()
    {
        IsActive = !IsActive;
    }

    public void AssignIdentifier(TPrimaryKey id) => Id = id;
}
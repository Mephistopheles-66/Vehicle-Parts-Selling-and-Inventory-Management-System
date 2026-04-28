using GearVault.Domain.Common.Base;

namespace GearVault.Domain.Entities;

public class Role(string name, string description, bool isRegisterable): BaseEntity<Guid>
{
    public string Name { get; private set; } = name;

    public string Description { get; private set; } = description;

    public bool IsRegisterable { get; private set; } = isRegisterable;

    public virtual ICollection<User>? Users { get; set; }

    public void Update(string name, string description, bool isRegisterable)
    {
        if (Name != name) Name = name;
        if (Description != description) Description = description;
        if (IsRegisterable != isRegisterable) IsRegisterable = isRegisterable;
    }
}
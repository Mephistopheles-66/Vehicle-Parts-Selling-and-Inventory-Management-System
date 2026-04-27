using VehicleParts.Domain.Entities;

namespace VehicleParts.Application.DTOs.Roles;

public static class RoleExtensionMethod
{
    public static RoleDto ToRoleDto(this Role role)
    {
        return new RoleDto
        {
            Id = role.Id,
            IsActive = role.IsActive,
            Name = role.Name,
            Description = role.Description,
            IsRegisterable = role.IsRegisterable
        };
    }
}
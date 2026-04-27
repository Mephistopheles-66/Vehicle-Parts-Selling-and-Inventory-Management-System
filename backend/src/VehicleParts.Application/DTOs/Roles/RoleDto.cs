using VehicleParts.Application.DTOs.Base;

namespace VehicleParts.Application.DTOs.Roles;

public class RoleDto : BaseDto
{
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public bool IsRegisterable { get; set; }
}
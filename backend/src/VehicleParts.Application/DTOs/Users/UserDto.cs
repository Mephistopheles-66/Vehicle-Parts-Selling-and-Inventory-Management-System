using VehicleParts.Application.DTOs.Roles;
using VehicleParts.Application.DTOs.Assets;
using VehicleParts.Application.Common.Response;

namespace VehicleParts.Application.DTOs.Users;

public class UserDto : BaseDto
{
    public string Name { get; set; } = string.Empty;

    public string EmailAddress { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string? Address { get; set; }

    public bool IsVerified { get; set; }

    public RoleDto Role { get; set; } = new();

    public AssetDto? ProfileImage { get; set; }
}
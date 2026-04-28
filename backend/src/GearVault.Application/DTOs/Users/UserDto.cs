using GearVault.Application.DTOs.Roles;
using GearVault.Application.DTOs.Assets;
using GearVault.Application.Common.Response;

namespace GearVault.Application.DTOs.Users;

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
using GearVault.Domain.Entities;
using GearVault.Application.DTOs.Profiles;
using GearVault.Application.DTOs.Roles;
using GearVault.Application.DTOs.Assets;

namespace GearVault.Application.DTOs.Users;

public static class UserExtensionMethod
{
    public static UserDto ToUserDto(this User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Address = user.Address,
            Role = user.Role?.ToRoleDto() ?? new RoleDto(),
            IsActive = user.IsActive,
            Username = user.Username,
            IsVerified = user.IsVerified,
            PhoneNumber = user.PhoneNumber,
            EmailAddress = user.EmailAddress,
            ProfileImage = user.ProfileImage?.ToAssetDto()
        };
    }

    public static UserDto ToUserDto(this User user, Role role)
    {
        return user.ToProfileDto(role);
    }
}

using GearVault.Domain.Entities;
using GearVault.Application.DTOs.Roles;
using GearVault.Application.DTOs.Assets;

namespace GearVault.Application.DTOs.Profiles;

public static class ProfileExtensionMethods
{
    public static ProfileDto ToProfileDto(this User user, Role role)
    {
        return new ProfileDto
        {
            Id = user.Id,
            Name = user.Name,
            Address = user.Address,
            Role = role.ToRoleDto(),
            IsActive = user.IsActive,
            Username = user.Username,
            IsVerified = user.IsVerified,
            PhoneNumber = user.PhoneNumber,
            EmailAddress = user.EmailAddress,
            ProfileImage = user.ProfileImage?.ToAssetDto()
        };
    }
}
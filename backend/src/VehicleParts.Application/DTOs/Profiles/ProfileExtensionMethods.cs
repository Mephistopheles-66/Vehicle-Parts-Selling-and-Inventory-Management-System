using VehicleParts.Domain.Entities;
using VehicleParts.Application.DTOs.Roles;
using VehicleParts.Application.DTOs.Assets;

namespace VehicleParts.Application.DTOs.Profiles;

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
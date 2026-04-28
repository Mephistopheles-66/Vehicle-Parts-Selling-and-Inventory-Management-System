using GearVault.Domain.Entities;
using GearVault.Application.DTOs.Profiles;

namespace GearVault.Application.DTOs.Users;

public static class UserExtensionMethod
{
    public static UserDto ToUserDto(this User user, Role role)
    {
        return user.ToProfileDto(role);
    }
}
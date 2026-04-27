using VehicleParts.Domain.Entities;
using VehicleParts.Application.DTOs.Profiles;

namespace VehicleParts.Application.DTOs.Users;

public static class UserExtensionMethod
{
    public static UserDto ToUserDto(this User user, Role role)
    {
        return user.ToProfileDto(role);
    }
}
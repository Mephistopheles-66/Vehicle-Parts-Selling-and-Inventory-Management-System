using VehicleParts.Application.DTOs.Roles;
using VehicleParts.Application.DTOs.Profiles;
using VehicleParts.Application.Common.Service;

namespace VehicleParts.Application.Interfaces.Services;

public interface IProfileService : ITransientService
{
    ProfileDto GetProfile();

    RoleDto GetAssignedRole();

    void UpdateProfile(UpdateProfileDto profile);

    void UpdateProfileImage(UpdateProfileImageDto profileImage);

    void RemoveProfileImage();

    void ChangePassword(ChangePasswordDto changePassword);
}
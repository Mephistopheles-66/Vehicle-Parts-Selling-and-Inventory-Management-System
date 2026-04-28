using GearVault.Application.DTOs.Roles;
using GearVault.Application.DTOs.Profiles;
using GearVault.Application.Common.Service;

namespace GearVault.Application.Interfaces.Services;

public interface IProfileService : ITransientService
{
    ProfileDto GetProfile();

    RoleDto GetAssignedRole();

    void UpdateProfile(UpdateProfileDto profile);

    void UpdateProfileImage(UpdateProfileImageDto profileImage);

    void RemoveProfileImage();

    void ChangePassword(ChangePasswordDto changePassword);
}
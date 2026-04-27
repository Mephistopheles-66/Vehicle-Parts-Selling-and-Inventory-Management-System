using System.Net;
using Gridforce.Attributes;
using Microsoft.AspNetCore.Mvc;
using VehicleParts.API.Controllers.Base;
using VehicleParts.Application.DTOs.Roles;
using VehicleParts.Application.DTOs.Profiles;
using VehicleParts.Application.Common.Response;
using VehicleParts.Application.Interfaces.Services;

namespace VehicleParts.API.Controllers;

public class ProfileController(IProfileService profileService) : BaseController<ProfileController>
{
    [HttpGet]
    [Documentation("GetProfile", "Retrieve the logged in user's profile details.")]
    public ResponseDto<ProfileDto> GetProfile()
    {
        var result = profileService.GetProfile();

        return new ResponseDto<ProfileDto>(
            (int)HttpStatusCode.OK,
            "Successfully fetched user's profile details.",
            result);
    }

    [HttpGet("assigned/role")]
    [Documentation("GetAssignedRole", "Retrieve the logged in user's assigned role.")]
    public ResponseDto<RoleDto> GetAssignedRole()
    {
        var result = profileService.GetAssignedRole();

        return new ResponseDto<RoleDto>(
            (int)HttpStatusCode.OK,
            "Successfully fetched user's assigned role.",
            result);
    }

    [HttpPut]
    [Documentation("UpdateProfile", "Update the logged in user's profile details.")]
    public ResponseDto<bool> UpdateProfile([FromBody] UpdateProfileDto profile)
    {
        profileService.UpdateProfile(profile);

        return new ResponseDto<bool>(
            (int)HttpStatusCode.OK,
            "Profile details updated successfully.",
            true);
    }

    [HttpPut("image")]
    [Documentation("UpdateProfileImage", "Update the logged in user's profile image.")]
    public ResponseDto<bool> UpdateProfileImage([FromForm] UpdateProfileImageDto profileImage)
    {
        profileService.UpdateProfileImage(profileImage);

        return new ResponseDto<bool>(
            (int)HttpStatusCode.OK,
            "Profile image updated successfully.",
            true);
    }

    [HttpDelete("image")]
    [Documentation("RemoveProfileImage", "Remove the logged in user's profile image.")]
    public ResponseDto<bool> RemoveProfileImage()
    {
        profileService.RemoveProfileImage();

        return new ResponseDto<bool>(
            (int)HttpStatusCode.OK,
            "Profile image removed successfully.",
            true);
    }

    [HttpPut("change/password")]
    [Documentation("ChangePassword", "Change the logged in user's password.")]
    public ResponseDto<bool> ChangePassword([FromBody] ChangePasswordDto changePassword)
    {
        profileService.ChangePassword(changePassword);

        return new ResponseDto<bool>(
            (int)HttpStatusCode.OK,
            "Password changed successfully.",
            true);
    }
}
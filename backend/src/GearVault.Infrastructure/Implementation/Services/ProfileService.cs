using GearVault.Domain.Common;
using GearVault.Domain.Entities;
using GearVault.Application.DTOs.Roles;
using GearVault.Application.Exceptions;
using GearVault.Application.Common.User;
using GearVault.Application.DTOs.Assets;
using GearVault.Application.Common.Helper;
using GearVault.Application.DTOs.Profiles;
using GearVault.Application.Interfaces.Services;
using GearVault.Application.Interfaces.Repositories;

namespace GearVault.Infrastructure.Implementation.Services;

public class ProfileService(
    IFileService fileService,
    IGenericRepository genericRepository,
    IApplicationUserService applicationUserService) : IProfileService
{
    private const string UserImagesFilePath = Constants.FilePath.UserImagesFilePath;

    public ProfileDto GetProfile()
    {
        var userId = applicationUserService.GetUserId;

        var user = genericRepository.GetById<User>(userId)
                   ?? throw new NotFoundException("The respective user has not been registered to our system.");

        var role = genericRepository.GetById<Role>(user.RoleId)
                   ?? throw new NotFoundException("The respective role could not be found.");

        return user.ToProfileDto(role);
    }

    public RoleDto GetAssignedRole()
    {
        var userId = applicationUserService.GetUserId;

        var user = genericRepository.GetById<User>(userId)
                   ?? throw new NotFoundException("The respective user has not been registered to our system.");

        var role = genericRepository.GetById<Role>(user.RoleId)
                   ?? throw new NotFoundException("The respective role could not be found.");

        return role.ToRoleDto();
    }

    public void UpdateProfile(UpdateProfileDto profile)
    {
        var userId = applicationUserService.GetUserId;

        var user = genericRepository.GetById<User>(userId)
                   ?? throw new NotFoundException("The respective user has not been registered to our system.");

        user.Update(
            user.RoleId,
            profile.Name,
            profile.Username,
            profile.EmailAddress,
            profile.Address,
            profile.PhoneNumber);

        genericRepository.Update(user);
    }

    public void UpdateProfileImage(UpdateProfileImageDto profileImage)
    {
        var userId = applicationUserService.GetUserId;

        var userModel = genericRepository.GetById<User>(userId)
                        ?? throw new NotFoundException("User was not found.");

        if (userModel.ProfileImage != null && !string.IsNullOrEmpty(userModel.ProfileImage.FileUrl))
        {
            var oldImagePath = Path.Combine(UserImagesFilePath, userModel.ProfileImage.FileUrl);

            fileService.DeleteFile(oldImagePath);
        }

        var asset = fileService.UploadDocument(profileImage.ProfileImage, UserImagesFilePath);

        userModel.UpdateProfileImage(asset.ToAssetModel());

        genericRepository.Update(userModel);
    }

    public void RemoveProfileImage()
    {
        var userId = applicationUserService.GetUserId;

        var userModel = genericRepository.GetById<User>(userId)
                        ?? throw new NotFoundException("User was not found.");

        if (userModel.ProfileImage == null)
        {
            throw new NotFoundException("The respective user does not have any uploaded profile image.");
        }

        var oldImagePath = Path.Combine(UserImagesFilePath, userModel.ProfileImage.FileUrl);

        fileService.DeleteFile(oldImagePath);

        userModel.RemoveProfileImage();

        genericRepository.Update(userModel);
    }

    public void ChangePassword(ChangePasswordDto changePassword)
    {
        var userId = applicationUserService.GetUserId;

        var userModel = genericRepository.GetById<User>(userId)
                        ?? throw new NotFoundException("User was not found.");

        if (!changePassword.CurrentPassword.VerifyHash(userModel.PasswordHash))
        {
            throw new BadRequestException("Current password is incorrect.");
        }

        if (changePassword.NewPassword != changePassword.ConfirmPassword)
        {
            throw new BadRequestException("New password and confirmation password do not match.");
        }

        var passwordHash = changePassword.NewPassword.Hash();

        userModel.UpdatePassword(passwordHash);

        genericRepository.Update(userModel);
    }
}
using System.Text.Json;
using VehicleParts.Domain.Common;
using VehicleParts.Domain.Entities;
using VehicleParts.Domain.Common.Enum;
using VehicleParts.Application.Exceptions;
using VehicleParts.Application.DTOs.Users;
using VehicleParts.Application.DTOs.Assets;
using VehicleParts.Application.Common.Helper;
using VehicleParts.Application.DTOs.Emails;
using VehicleParts.Application.Interfaces.Services;
using VehicleParts.Application.Interfaces.Repositories;

namespace VehicleParts.Infrastructure.Implementation.Services;

public class UserService(
    IFileService fileService,
    IGenericRepository genericRepository) : IUserService
{
    private const string UserImagesFilePath = Constants.FilePath.UserImagesFilePath;

    public List<UserDto> GetAllUsers(
        int pageNumber,
        int pageSize,
        out int rowCount,
        string? globalSearch = null,
        bool[]? isActive = null,
        string[]? orderBys = null,
        string? name = null,
        string? username = null,
        string? emailAddress = null,
        string? address = null,
        string? phoneNumber = null,
        List<Guid>? roleIds = null)
    {
        var roleIdentifiers = roleIds != null ? new HashSet<Guid>(roleIds) : null;

        var userModels = genericRepository.GetPagedResult<User>(pageNumber, pageSize, out rowCount,
            x => 
                (string.IsNullOrEmpty(globalSearch) 
                    || x.Name.ToLower().Contains(globalSearch.ToLower())
                    || x.Username.ToLower().Contains(globalSearch.ToLower())
                    || x.EmailAddress.ToLower().Contains(globalSearch.ToLower())
                    || (x.Address != null && x.Address.ToLower().Contains(globalSearch.ToLower()))
                    || x.PhoneNumber.ToLower().Contains(globalSearch.ToLower())) && 
                 (isActive == null || isActive.Contains(x.IsActive)) && 
                 (name == null || x.Name.ToLower().Contains(name.ToLower())) &&
                 (username == null || x.Username.ToLower().Contains(username.ToLower())) &&
                 (emailAddress == null || x.EmailAddress.ToLower().Contains(emailAddress.ToLower())) &&
                 (address == null || (x.Address != null && x.Address.ToLower().Contains(address.ToLower()))) &&
                 (phoneNumber == null || x.PhoneNumber.ToLower().Contains(phoneNumber.ToLower())) &&
                 (roleIdentifiers == null || roleIdentifiers.Contains(x.RoleId)),
            orderBys).ToList();
        
        if (userModels.Count == 0) return new List<UserDto>();

        var roles = genericRepository.Get<Role>(x =>
            userModels.Select(z => z.RoleId).Distinct().ToHashSet().Contains(x.Id)).ToList();

        var roleDictionary = roles.ToDictionary(x => x.Id, x => x);

        var users = new List<UserDto>();

        foreach (var userModel in userModels)
        {
            if (!roleDictionary.TryGetValue(userModel.RoleId, out var role))
                throw new NotFoundException($"The following role with the identifier of {userModel.RoleId} could not be found.");

            var user = userModel.ToUserDto(role);

            users.Add(user);
        }

        return users;
    }

    public List<UserDto> GetAllUsers(
        string? globalSearch = null,
        bool[]? isActive = null,
        string[]? orderBys = null,
        string? name = null,
        string? username = null,
        string? emailAddress = null,
        string? address = null,
        string? phoneNumber = null,
        List<Guid>? roleIds = null)
    {
        var roleIdentifiers = roleIds != null ? new HashSet<Guid>(roleIds) : null;

        var userModels = genericRepository.Get<User>(
            x => 
                (string.IsNullOrEmpty(globalSearch) 
                    || x.Name.ToLower().Contains(globalSearch.ToLower())
                    || x.Username.ToLower().Contains(globalSearch.ToLower())
                    || x.EmailAddress.ToLower().Contains(globalSearch.ToLower())
                    || (x.Address != null && x.Address.ToLower().Contains(globalSearch.ToLower()))
                    || x.PhoneNumber.ToLower().Contains(globalSearch.ToLower())) && 
                 (isActive == null || isActive.Contains(x.IsActive)) && 
                 (name == null || x.Name.ToLower().Contains(name.ToLower())) &&
                 (username == null || x.Username.ToLower().Contains(username.ToLower())) &&
                 (emailAddress == null || x.EmailAddress.ToLower().Contains(emailAddress.ToLower())) &&
                 (address == null || (x.Address != null && x.Address.ToLower().Contains(address.ToLower()))) &&
                 (phoneNumber == null || x.PhoneNumber.ToLower().Contains(phoneNumber.ToLower())) &&
                 (roleIdentifiers == null || roleIdentifiers.Contains(x.RoleId)),
            orderBys).ToList();

        if (userModels.Count == 0) return new List<UserDto>();

        var roles = roleIdentifiers != null 
            ? genericRepository.Get<Role>(x => roleIdentifiers.Contains(x.Id)).ToList()
            : genericRepository.Get<Role>().ToList();

        var roleDictionary = roles.ToDictionary(x => x.Id, x => x);

        var users = new List<UserDto>();

        foreach (var userModel in userModels)
        {
            if (!roleDictionary.TryGetValue(userModel.RoleId, out var role))
                throw new NotFoundException($"Role with identifier {userModel.RoleId} not found.");

            var user = userModel.ToUserDto(role);

            users.Add(user);
        }

        return users;
    }

    public UserDto GetUserById(Guid userId)
    {
        var userModel = genericRepository.GetById<User>(userId)
            ?? throw new NotFoundException($"User with identifier '{userId}' was not found.");

        var role = genericRepository.GetById<Role>(userModel.RoleId)
            ?? throw new NotFoundException("The following role could not be found.");

        return userModel.ToUserDto(role);
    }

    public void RegisterUser(RegisterUserDto user)
    {
        var duplicateUser = genericRepository.GetFirstOrDefault<User>(x => x.Username == user.Username || x.EmailAddress == user.EmailAddress || x.PhoneNumber == user.PhoneNumber);

        if (duplicateUser != null)
        {
            throw new BadRequestException("The following user with the specified username, phone number or email address already exists.");
        }

        var role = genericRepository.GetById<Role>(user.RoleId)
                   ?? throw new NotFoundException("The respective role with the specified identifier was not found.");

        if (!role.IsRegisterable)
        {
            throw new BadRequestException("A new user with the respective role cannot be be registered.");
        }

        var password = user.Password.Hash();

        var asset = user.ProfileImage != null ? fileService.UploadDocument(user.ProfileImage, UserImagesFilePath) : null;

        var userModel = new User(
            role.Id,
            user.Name,
            user.Username,
            user.EmailAddress,
            user.Address,
            asset?.ToAssetModel(),
            password,
            user.PhoneNumber,
            true,
            null);

        genericRepository.Insert(userModel);

        var emailModel = new RegistrationConfirmationDto()
        {
            UserId = userModel.Id,
            Password = user.Password.Encrypt(Constants.Password.SecretKey)
        };

        var outbox = new EmailOutbox(
            user.EmailAddress,
            user.Name,
            "Account Registration",
            EmailProcess.UserRegistration,
            JsonSerializer.Serialize(emailModel)
        );

        genericRepository.Insert(outbox);
    }

    public void UpdateUser(Guid userId, UpdateUserDto user)
    {
        if (userId != user.Id)
        {
            throw new BadRequestException("Route identifier does not match payload identifier.");
        }

        var userModel = genericRepository.GetById<User>(user.Id)
                            ?? throw new NotFoundException($"User with identifier '{userId}' was not found.");

        var duplicateUser = genericRepository.GetFirstOrDefault<User>(x =>
            (x.Username == user.Username || x.EmailAddress == user.EmailAddress || x.PhoneNumber == user.PhoneNumber) && x.Id != userModel.Id);

        if (duplicateUser != null)
        {
            throw new BadRequestException("The following user with the specified username or email address already exists.");
        }

        var roleId = userModel.RoleId;

        if (userModel.RoleId != user.RoleId)
        {
            var role = genericRepository.GetById<Role>(user.RoleId)
                           ?? throw new NotFoundException("The respective role with the specified identifier was not found.");

            roleId = role.Id;
        }

        if (user.ProfileImage is not null)
        {
            if (userModel.ProfileImage is not null && !string.IsNullOrEmpty(userModel.ProfileImage.FileUrl))
            {
                var oldImagePath = Path.Combine(UserImagesFilePath, userModel.ProfileImage.FileUrl);
                
                fileService.DeleteFile(oldImagePath);
            }

            var profileImageAsset = fileService.UploadDocument(user.ProfileImage, UserImagesFilePath);
            
            userModel.UpdateProfileImage(profileImageAsset.ToAssetModel());
        }
        
        userModel.Update(
            roleId,
            user.Name,
            user.Username,
            user.EmailAddress,
            user.Address,
            user.PhoneNumber);

        genericRepository.Update(userModel);
    }

    public void ActivateDeactivateUser(Guid userId)
    {
        var userModel = genericRepository.GetById<User>(userId)
                            ?? throw new NotFoundException($"User with identifier '{userId}' was not found.");

        var role = genericRepository.GetById<Role>(userModel.RoleId)
                   ?? throw new NotFoundException("The respective role with the specified identifier was not found.");

        if (!role.IsRegisterable)
        {
            throw new BadRequestException("A user with the respective assigned role cannot be deactivated.");
        }

        userModel.ActivateDeactivateEntity();

        genericRepository.Update(userModel);
    }
}
using System.Net;
using Gridforce.Attributes;
using Microsoft.AspNetCore.Mvc;
using VehicleParts.API.Controllers.Base;
using VehicleParts.Application.DTOs.Users;
using VehicleParts.Application.Common.Response;
using VehicleParts.Application.Interfaces.Services;

namespace VehicleParts.API.Controllers;

public class UserController(IUserService userService) : BaseController<UserController>
{
    [HttpGet]
    [Documentation("GetAllUsers", "Retrieve all users with pagination.")]
    public CollectionDto<UserDto> GetAllUsers(
        [FromQuery] PaginationQueryDto paginationQuery,
        [FromQuery] SearchAndActiveFlagQueryDto searchAndActiveFlagQuery,
        [FromQuery] OrderQueryDto orderQuery,
        [FromQuery] string? name = null,
        [FromQuery] string? username = null,
        [FromQuery] string? emailAddress = null,
        [FromQuery] string? address = null,
        [FromQuery] string? phoneNumber = null,
        [FromQuery] List<Guid>? roleIds = null)
    {
        var result = userService.GetAllUsers(
            paginationQuery.PageNumber,
            paginationQuery.PageSize,
            out var rowCount,
            searchAndActiveFlagQuery.GlobalSearch,
            searchAndActiveFlagQuery.IsActive,
            orderQuery.OrderBys,
            name,
            username,
            emailAddress,
            address,
            phoneNumber,
            roleIds);

        return new CollectionDto<UserDto>(
            (int)HttpStatusCode.OK,
            "Successfully fetched users.",
            result,
            rowCount,
            paginationQuery.PageNumber,
            paginationQuery.PageSize);
    }

    [HttpGet("list")]
    [Documentation("GetAllUsersList", "Retrieve all users without pagination.")]
    public ResponseDto<List<UserDto>> GetAllUsersList(
        [FromQuery] SearchAndActiveFlagQueryDto searchAndActiveFlagQuery,
        [FromQuery] OrderQueryDto orderQuery,
        [FromQuery] string? name = null,
        [FromQuery] string? username = null,
        [FromQuery] string? emailAddress = null,
        [FromQuery] string? address = null,
        [FromQuery] string? phoneNumber = null,
        [FromQuery] List<Guid>? roleIds = null)
    {
        var result = userService.GetAllUsers(
            searchAndActiveFlagQuery.GlobalSearch,
            searchAndActiveFlagQuery.IsActive,
            orderQuery.OrderBys,
            name,
            username,
            emailAddress,
            address,
            phoneNumber,
            roleIds);

        return new ResponseDto<List<UserDto>>(
            (int)HttpStatusCode.OK,
            "Successfully fetched users.",
            result);
    }

    [HttpGet("{userId:guid}")]
    [Documentation("GetUserById", "Retrieve user by identifier.")]
    public ResponseDto<UserDto> GetUserById([FromRoute] Guid userId)
    {
        var result = userService.GetUserById(userId);

        return new ResponseDto<UserDto>(
            (int)HttpStatusCode.OK,
            "Successfully fetched user details.",
            result);
    }

    [HttpPost]
    [Documentation("RegisterUser", "Register a new user by admin.")]
    public ResponseDto<bool> RegisterUser([FromForm] RegisterUserDto user)
    {
        userService.RegisterUser(user);

        return new ResponseDto<bool>(
            (int)HttpStatusCode.OK,
            "User registered successfully.",
            true);
    }

    [HttpPut("{userId:guid}")]
    [Documentation("UpdateUser", "Update user details.")]
    public ResponseDto<bool> UpdateUser([FromRoute] Guid userId, [FromForm] UpdateUserDto user)
    {
        userService.UpdateUser(userId, user);

        return new ResponseDto<bool>(
            (int)HttpStatusCode.OK,
            "User updated successfully.",
            true);
    }

    [HttpPatch("{userId:guid}/activate-deactivate")]
    [Documentation("ActivateDeactivateUser", "Activate or deactivate user.")]
    public ResponseDto<bool> ActivateDeactivateUser([FromRoute] Guid userId)
    {
        userService.ActivateDeactivateUser(userId);

        return new ResponseDto<bool>(
            (int)HttpStatusCode.OK,
            "User status updated successfully.",
            true);
    }
}
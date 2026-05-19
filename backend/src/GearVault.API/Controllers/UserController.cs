using System.Net;
using Gridforce.Attributes;
using Microsoft.AspNetCore.Mvc;
using GearVault.API.Controllers.Base;
using GearVault.Application.DTOs.Users;
using GearVault.Application.Common.Response;
using GearVault.Application.Interfaces.Services;

namespace GearVault.API.Controllers;

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

    [HttpGet("customers/search")]
    [Documentation("SearchCustomers", "Search customers by name, phone, email, ID, or vehicle number. Returns each customer with all of their vehicles. Staff-only.")]
    public ResponseDto<List<CustomerSearchResultDto>> SearchCustomers(
        [FromQuery] string q,
        [FromQuery] int limit = 20)
    {
        var result = userService.SearchCustomers(q, limit);

        return new ResponseDto<List<CustomerSearchResultDto>>(
            (int)HttpStatusCode.OK,
            "Successfully searched customers.",
            result);
    }

    [HttpPost("customers/walk-in")]
    [Documentation("RegisterWalkInCustomer", "Staff registers a walk-in customer along with their vehicles. Auto-generates username and password; emails the password to the customer.")]
    public ResponseDto<Guid> RegisterWalkInCustomer([FromBody] RegisterWalkInCustomerDto dto)
    {
        var customerId = userService.RegisterWalkInCustomer(dto);

        return new ResponseDto<Guid>(
            (int)HttpStatusCode.OK,
            "Customer registered successfully.",
            customerId);
    }

    [HttpGet("customers/{customerId:guid}/full-profile")]
    [Documentation("GetCustomerFullProfile", "Retrieve a customer's aggregated profile: their info, vehicles, recent invoices, and totals. Staff-only.")]
    public ResponseDto<CustomerFullProfileDto> GetCustomerFullProfile(
        [FromRoute] Guid customerId,
        [FromQuery] int recentInvoiceLimit = 20)
    {
        var result = userService.GetCustomerFullProfile(customerId, recentInvoiceLimit);

        return new ResponseDto<CustomerFullProfileDto>(
            (int)HttpStatusCode.OK,
            "Successfully fetched customer profile.",
            result);
    }

    [HttpGet("customers/reports/regulars")]
    [Documentation("GetRegularCustomerReports", "Retrieve regular customers ranked by purchase frequency.")]
    public ResponseDto<List<CustomerReportDto>> GetRegularCustomerReports([FromQuery] int limit = 20)
    {
        var result = userService.GetRegularCustomerReports(limit);

        return new ResponseDto<List<CustomerReportDto>>(
            (int)HttpStatusCode.OK,
            "Successfully fetched regular customer reports.",
            result);
    }

    [HttpGet("customers/reports/high-spenders")]
    [Documentation("GetHighSpenderReports", "Retrieve customers ranked by lifetime spending.")]
    public ResponseDto<List<CustomerReportDto>> GetHighSpenderReports([FromQuery] int limit = 20)
    {
        var result = userService.GetHighSpenderReports(limit);

        return new ResponseDto<List<CustomerReportDto>>(
            (int)HttpStatusCode.OK,
            "Successfully fetched high spender reports.",
            result);
    }

    [HttpGet("customers/reports/pending-credits")]
    [Documentation("GetPendingCreditReports", "Retrieve customers with pending credit balances.")]
    public ResponseDto<List<CustomerReportDto>> GetPendingCreditReports([FromQuery] int limit = 20)
    {
        var result = userService.GetPendingCreditReports(limit);

        return new ResponseDto<List<CustomerReportDto>>(
            (int)HttpStatusCode.OK,
            "Successfully fetched pending credit reports.",
            result);
    }
}

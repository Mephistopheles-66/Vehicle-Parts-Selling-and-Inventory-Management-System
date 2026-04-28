using System.Net;
using Gridforce.Attributes;
using Microsoft.AspNetCore.Mvc;
using GearVault.API.Controllers.Base;
using GearVault.Application.DTOs.Roles;
using GearVault.Application.Common.Response;
using GearVault.Application.Interfaces.Services;

namespace GearVault.API.Controllers;

public class RoleController(IRoleService roleService) : BaseController<RoleController>
{
    [HttpGet]
    [Documentation("GetAllRoles", "Retrieve all roles with pagination.")]
    public CollectionDto<RoleDto> GetAllRoles(
        [FromQuery] PaginationQueryDto paginationQuery,
        [FromQuery] SearchAndActiveFlagQueryDto searchAndActiveFlagQuery,
        [FromQuery] OrderQueryDto orderQuery,
        [FromQuery] string? name = null,
        [FromQuery] string? description = null)
    {
        var result = roleService.GetAllRoles(
            paginationQuery.PageNumber,
            paginationQuery.PageSize,
            out var rowCount,
            searchAndActiveFlagQuery.GlobalSearch,
            searchAndActiveFlagQuery.IsActive,
            orderQuery.OrderBys,
            name,
            description);

        return new CollectionDto<RoleDto>(
            (int)HttpStatusCode.OK,
            "Successfully fetched roles.",
            result,
            rowCount,
            paginationQuery.PageNumber,
            paginationQuery.PageSize);
    }

    [HttpGet("list")]
    [Documentation("GetAllRolesList", "Retrieve all roles without pagination.")]
    public ResponseDto<List<RoleDto>> GetAllRolesList(
        [FromQuery] SearchAndActiveFlagQueryDto searchAndActiveFlagQuery,
        [FromQuery] OrderQueryDto orderQuery,
        [FromQuery] string? name = null,
        [FromQuery] string? description = null)
    {
        var result = roleService.GetAllRoles(
            searchAndActiveFlagQuery.GlobalSearch,
            searchAndActiveFlagQuery.IsActive,
            orderQuery.OrderBys,
            name,
            description);

        return new ResponseDto<List<RoleDto>>(
            (int)HttpStatusCode.OK,
            "Successfully fetched roles.",
            result);
    }

    [HttpGet("available")]
    [Documentation("GetAllAvailableRoles", "Retrieve all available roles with pagination.")]
    public CollectionDto<RoleDto> GetAllAvailableRoles(
        [FromQuery] PaginationQueryDto paginationQuery,
        [FromQuery] SearchAndActiveFlagQueryDto searchAndActiveFlagQuery,
        [FromQuery] OrderQueryDto orderQuery,
        [FromQuery] string? name = null,
        [FromQuery] string? description = null)
    {
        var result = roleService.GetAllAvailableRoles(
            paginationQuery.PageNumber,
            paginationQuery.PageSize,
            out var rowCount,
            searchAndActiveFlagQuery.GlobalSearch,
            searchAndActiveFlagQuery.IsActive,
            orderQuery.OrderBys,
            name,
            description);

        return new CollectionDto<RoleDto>(
            (int)HttpStatusCode.OK,
            "Successfully fetched roles.",
            result,
            rowCount,
            paginationQuery.PageNumber,
            paginationQuery.PageSize);
    }

    [HttpGet("available/list")]
    [Documentation("GetAllAvailableRolesList", "Retrieve all available roles without pagination.")]
    public ResponseDto<List<RoleDto>> GetAllAvailableRolesList(
        [FromQuery] SearchAndActiveFlagQueryDto searchAndActiveFlagQuery,
        [FromQuery] OrderQueryDto orderQuery,
        [FromQuery] string? name = null,
        [FromQuery] string? description = null)
    {
        var result = roleService.GetAllAvailableRoles(
            searchAndActiveFlagQuery.GlobalSearch,
            searchAndActiveFlagQuery.IsActive,
            orderQuery.OrderBys,
            name,
            description);

        return new ResponseDto<List<RoleDto>>(
            (int)HttpStatusCode.OK,
            "Successfully fetched available roles.",
            result);
    }

    [HttpGet("{roleId:guid}")]
    [Documentation("GetRoleById", "Retrieve role by identifier.")]
    public ResponseDto<RoleDto> GetRoleById([FromRoute] Guid roleId)
    {
        var result = roleService.GetRoleById(roleId);

        return new ResponseDto<RoleDto>(
            (int)HttpStatusCode.OK,
            "Successfully fetched role details.",
            result);
    }
}
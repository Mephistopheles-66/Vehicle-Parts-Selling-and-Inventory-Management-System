using GearVault.Application.DTOs.Roles;
using GearVault.Application.Common.Service;

namespace GearVault.Application.Interfaces.Services;

public interface IRoleService : ITransientService
{
    List<RoleDto> GetAllRoles(
        int pageNumber,
        int pageSize,
        out int rowCount,
        string? globalSearch = null,
        bool[]? isActive = null,
        string[]? orderBys = null,
        string? name = null,
        string? description = null
    );

    List<RoleDto> GetAllRoles(
        string? globalSearch = null,
        bool[]? isActive = null,
        string[]? orderBys = null,
        string? name = null,
        string? description = null
    );

    // Available roles define the roles that can be assigned to users via the IsRegisterable flag.
    List<RoleDto> GetAllAvailableRoles(
        int pageNumber,
        int pageSize,
        out int rowCount,
        string? globalSearch = null,
        bool[]? isActive = null,
        string[]? orderBys = null,
        string? name = null,
        string? description = null
    );

    // Available roles define the roles that can be assigned to users via the IsRegisterable flag.
    List<RoleDto> GetAllAvailableRoles(
        string? globalSearch = null,
        bool[]? isActive = null,
        string[]? orderBys = null,
        string? name = null,
        string? description = null
    );

    RoleDto GetRoleById(Guid roleId);
}
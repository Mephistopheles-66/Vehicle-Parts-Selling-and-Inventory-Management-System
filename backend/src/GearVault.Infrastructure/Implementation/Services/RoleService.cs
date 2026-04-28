using GearVault.Domain.Entities;
using GearVault.Application.DTOs.Roles;
using GearVault.Application.Exceptions;
using GearVault.Application.Interfaces.Services;
using GearVault.Application.Interfaces.Repositories;

namespace GearVault.Infrastructure.Implementation.Services;

public class RoleService(IGenericRepository genericRepository) : IRoleService
{
    public List<RoleDto> GetAllRoles(
        int pageNumber,
        int pageSize,
        out int rowCount,
        string? globalSearch = null,
        bool[]? isActive = null,
        string[]? orderBys = null,
        string? name = null,
        string? description = null)
    {
        var roles = genericRepository.GetPagedResult<Role>(pageNumber, pageSize, out rowCount, 
            x =>
                (string.IsNullOrEmpty(globalSearch) 
                    || x.Name.ToLower().Contains(globalSearch.ToLower())
                    || x.Description.ToLower().Contains(globalSearch.ToLower())) && 
                (isActive == null || isActive.Contains(x.IsActive)) && 
                (name == null || x.Name.ToLower().Contains(name.ToLower())) &&
                (description == null || x.Description.ToLower().Contains(description.ToLower())),
            orderBys).ToList();

        if (roles.Count == 0) return new List<RoleDto>();

        return roles.ConvertAll(x => x.ToRoleDto());
    }

    public List<RoleDto> GetAllRoles(
        string? globalSearch = null,
        bool[]? isActive = null,
        string[]? orderBys = null,
        string? name = null,
        string? description = null)
    {
        var roles = genericRepository.Get<Role>(
            x =>
                (string.IsNullOrEmpty(globalSearch) 
                    || x.Name.Contains(globalSearch.ToLower())
                    || x.Description.Contains(globalSearch.ToLower())) && 
                (isActive == null || isActive.Contains(x.IsActive)) && 
                (name == null || x.Name.ToLower().Contains(name.ToLower())) &&
                (description == null || x.Description.ToLower().Contains(description.ToLower())),
            orderBys).ToList();

        if (roles.Count == 0) return new List<RoleDto>();

        return roles.ConvertAll(x => x.ToRoleDto());
    }

    public List<RoleDto> GetAllAvailableRoles(
        int pageNumber,
        int pageSize,
        out int rowCount,
        string? globalSearch = null,
        bool[]? isActive = null,
        string[]? orderBys = null,
        string? name = null,
        string? description = null)
    {
        var roles = genericRepository.GetPagedResult<Role>(pageNumber, pageSize, out rowCount, 
            x =>
                x.IsRegisterable &&
                (string.IsNullOrEmpty(globalSearch) 
                    || x.Name.Contains(globalSearch.ToLower())
                    || x.Description.Contains(globalSearch.ToLower())) && 
                (isActive == null || isActive.Contains(x.IsActive)) && 
                (name == null || x.Name.ToLower().Contains(name.ToLower())) &&
                (description == null || x.Description.ToLower().Contains(description.ToLower())),
            orderBys).ToList();
        
        if (roles.Count == 0) return new List<RoleDto>();

        return roles.ConvertAll(x => x.ToRoleDto());
    }

    public List<RoleDto> GetAllAvailableRoles(
        string? globalSearch = null,
        bool[]? isActive = null,
        string[]? orderBys = null,
        string? name = null,
        string? description = null)
    {
        var roles = genericRepository.Get<Role>( 
            x =>
                x.IsRegisterable &&
                (string.IsNullOrEmpty(globalSearch) 
                    || x.Name.Contains(globalSearch.ToLower())
                    || x.Description.Contains(globalSearch.ToLower())) && 
                (isActive == null || isActive.Contains(x.IsActive)) && 
                (name == null || x.Name.ToLower().Contains(name.ToLower())) &&
                (description == null || x.Description.ToLower().Contains(description.ToLower())),
            orderBys).ToList();

        if (roles.Count == 0) return new List<RoleDto>();

        return roles.ConvertAll(x => x.ToRoleDto());
    }

    public RoleDto GetRoleById(Guid roleId)
    {
        var role = genericRepository.GetById<Role>(roleId)
                   ?? throw new NotFoundException("The respective role could not be found.");

        return role.ToRoleDto();
    }
}
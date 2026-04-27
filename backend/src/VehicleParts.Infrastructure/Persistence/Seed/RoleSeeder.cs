using System.Reflection;
using VehicleParts.Domain.Common;
using VehicleParts.Domain.Entities;
using Microsoft.Extensions.Logging;
using VehicleParts.Application.Exceptions;
using VehicleParts.Application.Interfaces.Data;
using VehicleParts.Application.Interfaces.Seed;

namespace VehicleParts.Infrastructure.Persistence.Seed;

public class RoleSeeder(IApplicationDbContext dbContext, ILogger<AdministratorsSeeder> logger) : IDataSeeder
{
    public int Order => 10;

    public void Seed()
    {
        var roleSpecifications = GetRoleSpecificationFromConstants();

        foreach (var roleSpecification in roleSpecifications)
        {
            var role = dbContext.Roles.Find(roleSpecification.Id);

            if (role != null)
            {
                role.Update(
                    roleSpecification.Name,
                    roleSpecification.Description,
                    roleSpecification.IsRegisterable);

                dbContext.Roles.Update(role);
            }
            else
            {
                var roleModel = new Role(
                    roleSpecification.Name,
                    roleSpecification.Description,
                    roleSpecification.IsRegisterable);

                roleModel.AssignIdentifier(roleSpecification.Id);

                dbContext.Roles.Add(roleModel);

                logger.LogInformation("Seeded role {RoleName} with the identifier {RoleId}.", roleSpecification.Name, roleSpecification.Id);
            }
        }

        dbContext.SaveChanges();

        logger.LogInformation("Roles initialization successfully completed.");
    }

    private sealed record RoleSpecification(Guid Id, string Name, string Description, bool IsRegisterable);

    private static IEnumerable<RoleSpecification> GetRoleSpecificationFromConstants()
    {
        var roleSpecifications = new List<RoleSpecification>();

        foreach (var role in typeof(Constants.Roles).GetNestedTypes(BindingFlags.Public | BindingFlags.NonPublic))
        {
            var idField = role.GetField("Id", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.FlattenHierarchy);
            var nameField = role.GetField("Name", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.FlattenHierarchy);
            var descriptionField = role.GetField("Description", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.FlattenHierarchy);
            var isRegisterableField = role.GetField("IsRegisterable", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.FlattenHierarchy);

            if (idField?.FieldType != typeof(string) || nameField?.FieldType != typeof(string) || descriptionField?.FieldType != typeof(string) || isRegisterableField?.FieldType != typeof(bool))
            {
                continue;
            }

            var roleIdentifier = (string)(idField.GetValue(null) ?? throw new NotFoundException($"Role identifier could not be found for {role.Name}."));
            var roleName = (string)(nameField.GetValue(null) ?? throw new NotFoundException($"Role name could not be found for {role.Name}."));
            var roleDescription = (string)(descriptionField.GetValue(null) ?? throw new NotFoundException($"Role description could not be found for {role.Name}."));
            var roleRegisteredFlag = (bool)(isRegisterableField.GetValue(null) ?? throw new NotFoundException($"Role registration flag could not be found for {role.Name}."));

            if (!Guid.TryParse(roleIdentifier, out var id)) continue;
            if (string.IsNullOrWhiteSpace(roleName)) continue;
            if (string.IsNullOrWhiteSpace(roleDescription)) continue;

            roleSpecifications.Add(new RoleSpecification(id, roleName, roleDescription, roleRegisteredFlag));
        }

        return roleSpecifications;
    }
}
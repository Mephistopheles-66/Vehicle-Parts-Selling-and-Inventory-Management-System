using GearVault.Domain.Common;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using GearVault.Domain.Entities;
using GearVault.Application.Settings;
using GearVault.Application.Exceptions;
using GearVault.Application.Common.Helper;
using GearVault.Application.Interfaces.Seed;
using GearVault.Application.Interfaces.Data;

namespace GearVault.Infrastructure.Persistence.Seed;

public class AdministratorsSeeder(
    IApplicationDbContext dbContext,
    IOptions<SeedSettings> seedOptions,
    ILogger<AdministratorsSeeder> logger) : IDataSeeder
{
    private readonly SeedSettings _seedSettings = seedOptions.Value;

    public int Order => 50;

    public void Seed()
    {
        var administratorRole = dbContext.Roles.Find(Guid.Parse(Constants.Roles.Administrator.Id))
                             ?? throw new NotFoundException("Super admin role could not be found.");

        InitializeAdministrator(_seedSettings.Administrator, administratorRole);

        logger.LogInformation("Administrators initialization successfully completed.");
    }

    private void InitializeAdministrator(UserSeedSettings userSeedSettings, Role role)
    {
        var userIdentifier = new Guid(userSeedSettings.Identifier);

        var user = dbContext.Users.Find(userIdentifier);

        if (user is null)
        {
            var userModel = new User(
                role.Id,
                userSeedSettings.Name,
                userSeedSettings.Username,
                userSeedSettings.EmailAddress,
                userSeedSettings.Address,
                null,
                userSeedSettings.Password.Hash(),
                userSeedSettings.PhoneNumber,
                true,
                null);

            userModel.AssignIdentifier(userIdentifier);

            dbContext.Users.Add(userModel);

            logger.LogInformation($"Administrator with identifier {userModel.Id} successfully registered.");
        }
        else
        {
            user.Update(
                role.Id,
                userSeedSettings.Name,
                userSeedSettings.Username,
                userSeedSettings.EmailAddress,
                userSeedSettings.Address,
                userSeedSettings.PhoneNumber);

            dbContext.Users.Update(user);

            logger.LogInformation($"Administrator with identifier {user.Id} successfully updated.");
        }

        dbContext.SaveChanges();
    }
}

using Microsoft.Extensions.DependencyInjection;
using GearVault.Application.Interfaces.Seed;

namespace GearVault.Infrastructure.Dependency;

public static class MigrationService
{
    public static void AddDataSeedService(this IServiceCollection services)
    {
        var serviceProvider = services.BuildServiceProvider();
    
        using var scope = serviceProvider.CreateScope();
    
        var dbInitializer = scope.ServiceProvider.GetRequiredService<IDbInitializer>();

        #region Roles
        dbInitializer.InitializeRolesData();
        #endregion

        #region Administrators
        dbInitializer.InitializeAdministratorData();
        #endregion
    }
}
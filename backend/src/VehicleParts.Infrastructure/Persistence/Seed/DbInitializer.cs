using Microsoft.Extensions.Logging;
using VehicleParts.Application.Interfaces.Seed;

namespace VehicleParts.Infrastructure.Persistence.Seed;

public class DbInitializer(ILogger<DbInitializer> logger, IEnumerable<IDataSeeder> seeders) : IDbInitializer
{
    public void InitializeRolesData()
    {
        InitializeInternal(static x => x is RoleSeeder);
    }

    public void InitializeAdministratorData()
    {
        InitializeInternal(static x => x is AdministratorsSeeder);
    }

    private void InitializeInternal(Func<IDataSeeder, bool> predicate)
    {
        var dataSeeders = seeders.Where(predicate).OrderBy(x => x.Order).ToList();

        if (dataSeeders.Count == 0)
        {
            logger.LogWarning("No seeders found for the specified predicate.");
            return;
        }

        foreach (var dataSeeder in dataSeeders)
        {
            logger.LogInformation("Running seeder {SeederName} (Order {Order})", dataSeeder.GetType().Name, dataSeeder.Order);

            dataSeeder.Seed();
        }
    }
}
using Microsoft.EntityFrameworkCore;
using VehicleParts.Application.Settings;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore.Design;
using VehicleParts.Application.Common.Helper;

namespace VehicleParts.Infrastructure.Persistence;

public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var environmentName =
            Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

        var apiProjectPath = Path.GetFullPath(
            Path.Combine(Directory.GetCurrentDirectory(), "..", "VehicleParts.API")
        );

        var configurationDirectory = Path.Combine(apiProjectPath, "Configurations");

        var configuration = new ConfigurationBuilder()
            .AddJsonFile(Path.Combine(configurationDirectory, "database.json"), optional: false)
            .AddJsonFile(Path.Combine(configurationDirectory, $"database.{environmentName}.json"), optional: true)
            .Build();

        var databaseSettings = new DatabaseSettings();

        configuration.GetSection(nameof(DatabaseSettings)).Bind(databaseSettings);

        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

        optionsBuilder.UseDatabase(
            databaseSettings.DbProvider,
            databaseSettings.ConnectionString
        );

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}
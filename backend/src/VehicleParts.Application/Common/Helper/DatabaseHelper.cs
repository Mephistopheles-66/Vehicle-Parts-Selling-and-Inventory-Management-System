using VehicleParts.Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace VehicleParts.Application.Common.Helper;

public static class DatabaseHelper
{
    public static DbContextOptionsBuilder UseDatabase(this DbContextOptionsBuilder builder, string dbProvider, string connectionString)
    {
        return dbProvider.ToLowerInvariant() switch
        {
            Constants.DbProviderKeys.Npgsql => builder.UseNpgsql(connectionString, e =>
                e.MigrationsAssembly("VehicleParts.Infrastructure")),
            Constants.DbProviderKeys.SqlServer => builder.UseSqlServer(connectionString, e =>
                e.MigrationsAssembly("VehicleParts.Infrastructure")),
            _ => throw new InvalidOperationException($"DB Provider {dbProvider} is not supported."),
        };
    }
}
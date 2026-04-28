using GearVault.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace GearVault.Application.Settings;

public class DatabaseSettings : IValidatableObject
{
    public string DbProvider { get; set; } = string.Empty;

    public string ConnectionString { get; set; } = string.Empty;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (string.IsNullOrEmpty(DbProvider))
        {
            yield return new ValidationResult(
                $"{nameof(DatabaseSettings)}.{nameof(DbProvider)} is not configured.",
                [nameof(DbProvider)]);
        }

        if (string.IsNullOrEmpty(ConnectionString))
        {
            yield return new ValidationResult(
                $"{nameof(DatabaseSettings)}. A valid connection string for {GetDbProviderKey(DbProvider)} is not configured.");
        }
    }

    private static string GetDbProviderKey(string dbProvider)
    {
        return dbProvider switch
        {
            Constants.DbProviderKeys.Npgsql => "PostgreSQL",
            _ => "Database Provider."
        };
    }
}
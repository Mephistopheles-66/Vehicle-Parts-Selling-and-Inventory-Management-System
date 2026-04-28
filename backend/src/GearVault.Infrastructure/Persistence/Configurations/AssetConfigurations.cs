using System.Text.Json;
using System.Text.Json.Serialization;

namespace GearVault.Infrastructure.Persistence.Configurations;

public static class AssetConfigurations
{
    public static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        Converters =
        {
            new JsonStringEnumConverter()
        }
    };
}
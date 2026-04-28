using GearVault.Application.Common.Service;

namespace GearVault.Application.Interfaces.Seed;

public interface IDataSeeder : IScopedService
{
    /// <summary>
    /// Order in which this seeder should execute.
    /// </summary>
    int Order { get; }

    void Seed();
}

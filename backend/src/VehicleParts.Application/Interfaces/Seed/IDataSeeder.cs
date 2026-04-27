using VehicleParts.Application.Common.Service;

namespace VehicleParts.Application.Interfaces.Seed;

public interface IDataSeeder : IScopedService
{
    /// <summary>
    /// Order in which this seeder should execute.
    /// </summary>
    int Order { get; }

    void Seed();
}

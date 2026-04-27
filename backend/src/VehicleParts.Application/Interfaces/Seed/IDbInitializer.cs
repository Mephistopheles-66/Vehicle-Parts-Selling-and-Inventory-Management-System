using VehicleParts.Application.Common.Service;

namespace VehicleParts.Application.Interfaces.Seed;

public interface IDbInitializer : IScopedService
{
    void InitializeRolesData();

    void InitializeAdministratorData();
}
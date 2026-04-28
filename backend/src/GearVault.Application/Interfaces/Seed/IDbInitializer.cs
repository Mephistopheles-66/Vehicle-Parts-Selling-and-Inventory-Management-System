using GearVault.Application.Common.Service;

namespace GearVault.Application.Interfaces.Seed;

public interface IDbInitializer : IScopedService
{
    void InitializeRolesData();

    void InitializeAdministratorData();
}
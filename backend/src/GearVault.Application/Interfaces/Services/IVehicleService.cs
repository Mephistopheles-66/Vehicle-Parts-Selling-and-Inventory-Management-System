using GearVault.Application.Common.Service;
using GearVault.Application.DTOs.Vehicles;

namespace GearVault.Application.Interfaces.Services;

public interface IVehicleService : ITransientService
{
    List<VehicleDto> GetMyVehicles();

    VehicleDto GetVehicleById(Guid vehicleId);

    VehicleDto CreateVehicle(CreateVehicleDto dto);

    VehicleDto UpdateVehicle(Guid vehicleId, UpdateVehicleDto dto);

    void DeleteVehicle(Guid vehicleId);
}

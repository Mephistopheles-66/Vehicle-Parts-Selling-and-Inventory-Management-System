using GearVault.Domain.Entities;

namespace GearVault.Application.DTOs.Vehicles;

public static class VehicleExtensionMethods
{
    public static VehicleDto ToVehicleDto(this Vehicle vehicle)
    {
        return new VehicleDto
        {
            Id = vehicle.Id,
            CustomerId = vehicle.CustomerId,
            VehicleNumber = vehicle.VehicleNumber,
            Make = vehicle.Make,
            Model = vehicle.Model,
            Year = vehicle.Year,
            ChassisNumber = vehicle.ChassisNumber,
            EngineNumber = vehicle.EngineNumber,
            IsActive = vehicle.IsActive
        };
    }
}

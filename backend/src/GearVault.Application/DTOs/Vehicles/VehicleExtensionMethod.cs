using GearVault.Domain.Entities;

namespace GearVault.Application.DTOs.Vehicles;

public static class VehicleExtensionMethod
{
    public static VehicleDto ToVehicleDto(this Vehicle vehicle)
    {
        return new VehicleDto
        {
            Id = vehicle.Id,
            OwnerUserId = vehicle.OwnerUserId,
            PlateNumber = vehicle.PlateNumber,
            Make = vehicle.Make,
            Model = vehicle.Model,
            Year = vehicle.Year,
            Vin = vehicle.Vin,
            Mileage = vehicle.Mileage,
            FuelType = vehicle.FuelType.ToString().ToUpper(),
            RegistrationDate = vehicle.RegistrationDate,
            IsActive = vehicle.IsActive,
            CreatedAt = vehicle.CreatedAt,
            UpdatedAt = vehicle.UpdatedAt
        };
    }
}

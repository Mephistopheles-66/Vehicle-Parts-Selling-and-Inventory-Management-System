using GearVault.Domain.Entities;
using GearVault.Application.DTOs.Users;

namespace GearVault.Application.DTOs.Vehicles;

public static class VehicleExtensionMethods
{
    public static VehicleDto ToVehicleDto(this Vehicle vehicle, User? customer = null)
    {
        return new VehicleDto
        {
            Id = vehicle.Id,
            Customer = (customer ?? vehicle.User)?.ToUserDto() ?? new(),
            VehicleNumber = vehicle.VehicleNumber,
            LicenseNumber = vehicle.LicenseNumber,
            Make = vehicle.Make,
            Model = vehicle.Model,
            Year = vehicle.Year,
            FuelType = vehicle.FuelType,
            IsActive = vehicle.IsActive
        };
    }
}

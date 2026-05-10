using GearVault.Domain.Common.Enum;

namespace GearVault.Application.DTOs.Vehicles;

public class UpdateVehicleDto
{
    public string? VehicleNumber { get; set; }

    public string? LicenseNumber { get; set; }

    public string? Make { get; set; }

    public string? Model { get; set; }

    public int? Year { get; set; }

    public FuelType? FuelType { get; set; }
}

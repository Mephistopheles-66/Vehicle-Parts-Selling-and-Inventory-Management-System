using GearVault.Domain.Common.Enum;

namespace GearVault.Application.DTOs.Vehicles;

public class CreateVehicleDto
{
    public Guid UserId { get; set; }

    public string VehicleNumber { get; set; } = string.Empty;

    public string LicenseNumber { get; set; } = string.Empty;

    public string Make { get; set; } = string.Empty;

    public string Model { get; set; } = string.Empty;

    public int Year { get; set; }

    public FuelType FuelType { get; set; } = FuelType.Gas;
}

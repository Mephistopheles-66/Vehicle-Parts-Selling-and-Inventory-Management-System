namespace GearVault.Application.DTOs.Vehicles;

public class CreateVehicleDto
{
    public string VehicleNumber { get; set; } = string.Empty;

    public string Make { get; set; } = string.Empty;

    public string Model { get; set; } = string.Empty;

    public int Year { get; set; }

    public string? ChassisNumber { get; set; }

    public string? EngineNumber { get; set; }
}

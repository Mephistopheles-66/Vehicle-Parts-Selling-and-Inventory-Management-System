using GearVault.Application.DTOs.Base;

namespace GearVault.Application.DTOs.Vehicles;

public class VehicleDto : BaseDto
{
    public Guid CustomerId { get; set; }

    public string VehicleNumber { get; set; } = string.Empty;

    public string Make { get; set; } = string.Empty;

    public string Model { get; set; } = string.Empty;

    public int Year { get; set; }

    public string? ChassisNumber { get; set; }

    public string? EngineNumber { get; set; }
}

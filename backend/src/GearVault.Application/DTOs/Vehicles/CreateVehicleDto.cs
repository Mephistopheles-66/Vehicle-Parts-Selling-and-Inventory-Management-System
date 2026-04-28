namespace GearVault.Application.DTOs.Vehicles;

public class CreateVehicleDto
{
    public string PlateNumber { get; set; } = string.Empty;
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public string? Vin { get; set; }
    public int Mileage { get; set; }
    public string FuelType { get; set; } = "PETROL";
    public DateTime RegistrationDate { get; set; }
    public bool IsActive { get; set; } = true;
}

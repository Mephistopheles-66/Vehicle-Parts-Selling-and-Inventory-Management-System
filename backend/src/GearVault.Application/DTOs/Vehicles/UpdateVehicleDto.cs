namespace GearVault.Application.DTOs.Vehicles;

public class UpdateVehicleDto
{
    public string? PlateNumber { get; set; }
    public string? Make { get; set; }
    public string? Model { get; set; }
    public int? Year { get; set; }
    public string? Vin { get; set; }
    public int? Mileage { get; set; }
    public string? FuelType { get; set; }
    public DateTime? RegistrationDate { get; set; }
    public bool? IsActive { get; set; }
}

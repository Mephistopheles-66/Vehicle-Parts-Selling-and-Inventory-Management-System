using GearVault.Application.DTOs.Vehicles;

namespace GearVault.Application.DTOs.Customers;

public class CreateCustomerDto
{
    public string FullName { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string? EmailAddress { get; set; }

    public string? Address { get; set; }

    public List<CreateVehicleDto> Vehicles { get; set; } = new();
}

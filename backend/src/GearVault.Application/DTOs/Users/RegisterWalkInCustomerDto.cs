using GearVault.Application.DTOs.Vehicles;

namespace GearVault.Application.DTOs.Users;

// Input DTO for staff registering a walk-in customer.
// Differs from RegisterUserDto: no password (auto-generated), no username
// (auto-derived from phone), no profile image, and vehicles are nested.
public class RegisterWalkInCustomerDto
{
    public string Name { get; set; } = string.Empty;

    public string EmailAddress { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string? Address { get; set; }

    public List<CreateWalkInVehicleDto> Vehicles { get; set; } = new();
}


// Lightweight vehicle DTO used inside walk-in registration
// no UserId because the user is being created in the same request.
public class CreateWalkInVehicleDto
{
    public string VehicleNumber { get; set; } = string.Empty;

    public string LicenseNumber { get; set; } = string.Empty;

    public string Make { get; set; } = string.Empty;

    public string Model { get; set; } = string.Empty;

    public int Year { get; set; }

    public Domain.Common.Enum.FuelType FuelType { get; set; } = Domain.Common.Enum.FuelType.Petrol;
}
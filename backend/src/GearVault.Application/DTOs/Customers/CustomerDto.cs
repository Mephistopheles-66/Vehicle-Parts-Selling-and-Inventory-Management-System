using GearVault.Application.DTOs.Base;
using GearVault.Application.DTOs.Vehicles;

namespace GearVault.Application.DTOs.Customers;

public class CustomerDto : BaseDto
{
    public string FullName { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string? EmailAddress { get; set; }

    public string? Address { get; set; }

    public Guid? UserId { get; set; }

    public DateTime CreatedAt { get; set; }

    public List<VehicleDto> Vehicles { get; set; } = new();
}

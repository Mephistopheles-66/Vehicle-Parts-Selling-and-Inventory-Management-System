using GearVault.Application.DTOs.Vehicles;

namespace GearVault.Application.DTOs.Users;

// Customer (User with Role=Customer) plus their vehicles —
// returned by the staff-side customer search.
public class CustomerSearchResultDto
{
    public UserDto Customer { get; set; } = new();

    public List<VehicleDto> Vehicles { get; set; } = new();
}
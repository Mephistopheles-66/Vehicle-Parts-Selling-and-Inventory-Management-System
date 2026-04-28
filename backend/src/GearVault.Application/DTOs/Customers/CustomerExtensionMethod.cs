using GearVault.Domain.Entities;
using GearVault.Application.DTOs.Vehicles;

namespace GearVault.Application.DTOs.Customers;

public static class CustomerExtensionMethods
{
    public static CustomerDto ToCustomerDto(this Customer customer, IEnumerable<Vehicle>? vehicles = null)
    {
        return new CustomerDto
        {
            Id = customer.Id,
            FullName = customer.FullName,
            PhoneNumber = customer.PhoneNumber,
            EmailAddress = customer.EmailAddress,
            Address = customer.Address,
            UserId = customer.UserId,
            IsActive = customer.IsActive,
            CreatedAt = customer.CreatedAt,
            Vehicles = (vehicles ?? customer.Vehicles ?? Enumerable.Empty<Vehicle>())
                .Select(v => v.ToVehicleDto())
                .ToList()
        };
    }
}

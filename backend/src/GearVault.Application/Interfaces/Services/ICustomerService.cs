using GearVault.Application.Common.Service;
using GearVault.Application.DTOs.Customers;

namespace GearVault.Application.Interfaces.Services;

public interface ICustomerService : ITransientService
{
    List<CustomerDto> GetAllCustomers(
        int pageNumber,
        int pageSize,
        out int rowCount,
        string? globalSearch = null,
        bool[]? isActive = null,
        string[]? orderBys = null);

    /// <summary>
    /// Searches customers by name, phone number, customer ID (Guid string),
    /// or vehicle number. Used by the staff-side customer search feature.
    /// </summary>
    List<CustomerDto> SearchCustomers(string searchTerm, int limit = 20);

    CustomerDto GetCustomerById(Guid customerId);

    /// <summary>
    /// Registers a walk-in customer along with their vehicles.
    /// Called by the staff-side registration endpoint.
    /// </summary>
    Guid RegisterCustomer(CreateCustomerDto dto);

    /// <summary>
    /// Internal helper used by Aditi's customer self-registration flow.
    /// Creates a Customer linked to an existing User account.
    /// </summary>
    Guid CreateCustomerForUser(Guid userId, string fullName, string phoneNumber, string? emailAddress, string? address);

    void UpdateCustomer(Guid customerId, UpdateCustomerDto dto);

    void ActivateDeactivateCustomer(Guid customerId);
}

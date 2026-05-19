using GearVault.Application.DTOs.Users;
using GearVault.Application.Common.Service;

namespace GearVault.Application.Interfaces.Services;

public interface IUserService : ITransientService
{
    List<UserDto> GetAllUsers(
        int pageNumber,
        int pageSize,
        out int rowCount,
        string? globalSearch = null,
        bool[]? isActive = null,
        string[]? orderBys = null,
        string? name = null,
        string? username = null,
        string? emailAddress = null,
        string? address = null,
        string? phoneNumber = null,
        List<Guid>? roleIds = null  
    );

    List<UserDto> GetAllUsers(
        string? globalSearch = null,
        bool[]? isActive = null,
        string[]? orderBys = null,
        string? name = null,
        string? username = null,
        string? emailAddress = null,
        string? address = null,
        string? phoneNumber = null,
        List<Guid>? roleIds = null    
    );

    UserDto GetUserById(Guid userId);

    void RegisterUser(RegisterUserDto user);

    void UpdateUser(Guid userId, UpdateUserDto user);
    
    void ActivateDeactivateUser(Guid userId);

    // Searches customers (Users with Role = Customer) by partial match
    // against name, phone, email, customer ID, or vehicle number.
    // Returns each matching customer with all of their vehicles.
    // Staff-only — does NOT enforce ownership check.
    List<CustomerSearchResultDto> SearchCustomers(string searchTerm, int limit = 20);

    // Staff-facing walk-in customer registration.
    // Creates a User with RoleId = Customer using an auto-generated
    // username (from phone) and temporary password (emailed to the customer),
    // then creates the linked Vehicles in the same transaction.
    // Returns the new customer's UserId.
    Guid RegisterWalkInCustomer(RegisterWalkInCustomerDto dto);

    // Returns a customer's aggregated profile: their user record,
    // all their vehicles, recent invoices, and computed totals.
    // Used by the staff-facing customer details page.
    CustomerFullProfileDto GetCustomerFullProfile(Guid customerId, int recentInvoiceLimit = 20);

    List<CustomerReportDto> GetRegularCustomerReports(int limit = 20);

    List<CustomerReportDto> GetHighSpenderReports(int limit = 20);

    List<CustomerReportDto> GetPendingCreditReports(int limit = 20);
}

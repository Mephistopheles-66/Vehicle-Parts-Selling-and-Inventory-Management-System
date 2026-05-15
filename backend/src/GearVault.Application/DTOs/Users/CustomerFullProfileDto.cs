using GearVault.Application.DTOs.Vehicles;
using GearVault.Application.DTOs.SalesInvoices;

namespace GearVault.Application.DTOs.Users;

// Aggregate view of a customer for the staff-facing customer details page.
// Combines profile, vehicles, and recent purchase history in one response.
public class CustomerFullProfileDto
{
    public UserDto Customer { get; set; } = new();

    public List<VehicleDto> Vehicles { get; set; } = new();

    public List<SalesInvoiceDto> RecentInvoices { get; set; } = new();

    public int TotalInvoiceCount { get; set; }

    public decimal LifetimeSpend { get; set; }

    public decimal OutstandingBalance { get; set; }
}
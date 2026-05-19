namespace GearVault.Application.DTOs.Users;

public class CustomerReportDto
{
    public UserDto Customer { get; set; } = new();

    public int VehicleCount { get; set; }

    public int InvoiceCount { get; set; }

    public decimal TotalSpent { get; set; }

    public decimal PendingCredit { get; set; }

    public DateTime? LastPurchaseAt { get; set; }
}


namespace GearVault.Application.DTOs.Emails;

public class SalesInvoiceEmailPayloadDto
{
    public Guid InvoiceId { get; set; }

    public string InvoiceNumber { get; set; } = string.Empty;

    public string UserName { get; set; } = string.Empty;

    public decimal SubTotal { get; set; }

    public decimal DiscountAmount { get; set; }

    public decimal TotalAmount { get; set; }

    public decimal BalanceDue { get; set; }

    public DateTime CreatedAt { get; set; }
}


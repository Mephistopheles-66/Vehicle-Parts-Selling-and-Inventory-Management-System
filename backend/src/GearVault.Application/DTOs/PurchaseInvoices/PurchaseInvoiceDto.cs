using GearVault.Application.DTOs.Vendors;

namespace GearVault.Application.DTOs.PurchaseInvoices;

public class PurchaseInvoiceDto
{
    public Guid Id { get; set; }
    public VendorDto Vendor { get; set; } = new();
    public string InvoiceNo { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public DateTime? DueDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<PurchaseInvoiceLineItemDto> LineItems { get; set; } = [];
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal GrandTotal { get; set; }
    public decimal AmountPaid { get; set; }
    public decimal BalanceDue { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

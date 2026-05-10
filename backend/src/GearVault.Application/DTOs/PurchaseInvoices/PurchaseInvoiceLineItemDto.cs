using GearVault.Application.DTOs.Parts;

namespace GearVault.Application.DTOs.PurchaseInvoices;

public class PurchaseInvoiceLineItemDto
{
    public Guid Id { get; set; }
    public PartDto Part { get; set; } = new();
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Total { get; set; }
}

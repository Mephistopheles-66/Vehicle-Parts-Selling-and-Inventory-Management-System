namespace GearVault.Application.DTOs.PurchaseInvoices;

public class PurchaseInvoiceLineItemDto
{
    public Guid Id { get; set; }
    public Guid PartId { get; set; }
    public string PartName { get; set; } = string.Empty;
    public string PartNumber { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Total { get; set; }
}

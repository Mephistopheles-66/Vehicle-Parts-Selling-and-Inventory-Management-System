namespace VehicleParts.Application.DTOs.PurchaseInvoices;

public class CreatePurchaseInvoiceDto
{
    public Guid VendorId { get; set; }
    public string InvoiceNo { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public DateTime? DueDate { get; set; }
    public List<CreatePurchaseInvoiceLineItemDto> LineItems { get; set; } = [];
    public decimal Discount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal AmountPaid { get; set; }
}

public class CreatePurchaseInvoiceLineItemDto
{
    public Guid PartId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}

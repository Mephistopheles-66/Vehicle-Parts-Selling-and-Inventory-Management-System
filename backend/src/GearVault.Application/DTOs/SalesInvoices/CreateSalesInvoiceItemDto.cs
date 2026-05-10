namespace GearVault.Application.DTOs.SalesInvoices;

public class CreateSalesInvoiceItemDto
{
    public Guid PartId { get; set; }

    public int Quantity { get; set; }
}

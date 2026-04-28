using GearVault.Application.DTOs.Base;

namespace GearVault.Application.DTOs.SalesInvoices;

public class SalesInvoiceItemDto : BaseDto
{
    public Guid SalesInvoiceId { get; set; }

    public Guid PartId { get; set; }

    public string PartName { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal LineTotal { get; set; }
}

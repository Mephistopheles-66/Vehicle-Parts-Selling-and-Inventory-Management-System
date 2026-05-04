using GearVault.Application.DTOs.Base;
using GearVault.Application.DTOs.Parts;

namespace GearVault.Application.DTOs.SalesInvoices;

public class SalesInvoiceItemDto : BaseDto
{
    public Guid SalesInvoiceId { get; set; }

    public PartDto Part { get; set; } = new();

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal LineTotal { get; set; }
}

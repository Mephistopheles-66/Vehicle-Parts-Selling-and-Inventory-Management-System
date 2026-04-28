using GearVault.Domain.Common.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearVault.Domain.Entities;

public class SalesInvoiceItem(
    Guid salesInvoiceId,
    Guid partId,
    string partName,
    int quantity,
    decimal unitPrice,
    decimal lineTotal
) : BaseEntity<Guid>
{
    [ForeignKey(nameof(SalesInvoice))]
    public Guid SalesInvoiceId { get; private set; } = salesInvoiceId;

    [ForeignKey(nameof(Part))]
    public Guid PartId { get; private set; } = partId;

    // Snapshot — keeps the invoice readable even if the part is later renamed/deleted.
    public string PartName { get; private set; } = partName;

    public int Quantity { get; private set; } = quantity;

    public decimal UnitPrice { get; private set; } = unitPrice;

    public decimal LineTotal { get; private set; } = lineTotal;

    public virtual SalesInvoice? SalesInvoice { get; set; }

    public virtual Part? Part { get; set; }
}
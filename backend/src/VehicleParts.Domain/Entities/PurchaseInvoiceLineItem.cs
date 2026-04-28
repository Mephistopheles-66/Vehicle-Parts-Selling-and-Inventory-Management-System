using VehicleParts.Domain.Common.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace VehicleParts.Domain.Entities;

public class PurchaseInvoiceLineItem(
    Guid purchaseInvoiceId,
    Guid partId,
    int quantity,
    decimal unitPrice
) : BaseEntity<Guid>
{
    [ForeignKey(nameof(PurchaseInvoice))]
    public Guid PurchaseInvoiceId { get; private set; } = purchaseInvoiceId;

    [ForeignKey(nameof(Part))]
    public Guid PartId { get; private set; } = partId;

    public int Quantity { get; private set; } = quantity;

    public decimal UnitPrice { get; private set; } = unitPrice;

    public decimal Total { get; private set; } = quantity * unitPrice;

    public virtual PurchaseInvoice? PurchaseInvoice { get; set; }

    public virtual Part? Part { get; set; }
}

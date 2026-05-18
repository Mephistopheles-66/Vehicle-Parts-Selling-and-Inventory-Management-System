using GearVault.Domain.Common.Base;
using GearVault.Domain.Common.Enum;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearVault.Domain.Entities;

public class PurchaseInvoice(
    Guid vendorId,
    string invoiceNo,
    DateTime invoiceDate,
    DateTime? dueDate,
    decimal discount,
    decimal taxAmount,
    decimal amountPaid
) : BaseEntity<Guid>
{
    [ForeignKey(nameof(Vendor))]
    public Guid VendorId { get; private set; } = vendorId;

    public string InvoiceNo { get; private set; } = invoiceNo;

    public DateTime InvoiceDate { get; private set; } = invoiceDate;

    public DateTime? DueDate { get; private set; } = dueDate;

    public InvoiceStatus Status { get; private set; } = InvoiceStatus.Draft;

    public decimal Subtotal { get; private set; }

    public decimal Discount { get; private set; } = discount;

    public decimal TaxAmount { get; private set; } = taxAmount;

    public decimal GrandTotal { get; private set; }

    public decimal AmountPaid { get; private set; } = amountPaid;

    public decimal BalanceDue { get; private set; }

    public DateTime UpdatedAt { get; private set; } = DateTime.Now;

    public virtual Vendor? Vendor { get; set; }

    public virtual ICollection<PurchaseInvoiceLineItem> LineItems { get; set; } = new List<PurchaseInvoiceLineItem>();

    public void RecalculateTotals()
    {
        Subtotal = LineItems.Sum(li => (decimal)li.Quantity * li.UnitPrice);
        GrandTotal = Subtotal - Discount + TaxAmount;
        BalanceDue = GrandTotal - AmountPaid;
        UpdatedAt = DateTime.Now;
    }

    public void Post()
    {
        Status = InvoiceStatus.Posted;
        UpdatedAt = DateTime.Now;
    }

    public void Cancel()
    {
        Status = InvoiceStatus.Cancelled;
        UpdatedAt = DateTime.Now;
    }
}

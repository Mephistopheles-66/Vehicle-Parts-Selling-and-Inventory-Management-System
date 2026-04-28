using GearVault.Domain.Common.Base;
using GearVault.Domain.Common.Enum;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearVault.Domain.Entities;

public class SalesInvoice(
    string invoiceNumber,
    Guid customerId,
    Guid? vehicleId,
    Guid staffId,
    decimal subTotal,
    decimal discountAmount,
    decimal totalAmount,
    PaymentStatus paymentStatus,
    string? remarks
) : AuditableEntity<Guid>
{
    public string InvoiceNumber { get; private set; } = invoiceNumber;

    [ForeignKey(nameof(Customer))]
    public Guid CustomerId { get; private set; } = customerId;

    [ForeignKey(nameof(Vehicle))]
    public Guid? VehicleId { get; private set; } = vehicleId;

    [ForeignKey(nameof(Staff))]
    public Guid StaffId { get; private set; } = staffId;

    public decimal SubTotal { get; private set; } = subTotal;

    public decimal DiscountAmount { get; private set; } = discountAmount;

    public decimal TotalAmount { get; private set; } = totalAmount;

    public PaymentStatus PaymentStatus { get; private set; } = paymentStatus;

    public string? Remarks { get; private set; } = remarks;

    public DateTime? PaidAt { get; private set; }

    public bool EmailSent { get; private set; }

    public DateTime? EmailSentAt { get; private set; }

    public virtual Customer? Customer { get; set; }

    public virtual Vehicle? Vehicle { get; set; }

    public virtual User? Staff { get; set; }

    public virtual ICollection<SalesInvoiceItem>? Items { get; set; }

    public void MarkAsPaid()
    {
        PaymentStatus = PaymentStatus.Paid;
        PaidAt = DateTime.Now;
    }

    public void MarkEmailSent()
    {
        EmailSent = true;
        EmailSentAt = DateTime.Now;
    }
}

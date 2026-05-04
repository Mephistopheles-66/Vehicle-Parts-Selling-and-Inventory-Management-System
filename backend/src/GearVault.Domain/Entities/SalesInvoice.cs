using GearVault.Domain.Common.Base;
using GearVault.Domain.Common.Enum;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearVault.Domain.Entities;

public class SalesInvoice(
    string invoiceNumber,
    Guid vehicleId,
    Guid staffId,
    decimal subTotal,
    decimal discountAmount,
    decimal totalAmount,
    PaymentStatus paymentStatus,
    string? remarks
) : AuditableEntity<Guid>
{
    public string InvoiceNumber { get; private set; } = invoiceNumber;

    [ForeignKey(nameof(Vehicle))]
    public Guid VehicleId { get; private set; } = vehicleId;

    [ForeignKey(nameof(Staff))]
    public Guid StaffId { get; private set; } = staffId;

    public decimal SubTotal { get; private set; } = subTotal;

    public decimal DiscountAmount { get; private set; } = discountAmount;

    public decimal TotalAmount { get; private set; } = totalAmount;

    public decimal AmountPaid { get; private set; }

    public decimal BalanceDue { get; private set; } = totalAmount;

    public DateTime? CreditDueDate { get; private set; }

    public DateTime? LastCreditReminderSentAt { get; private set; }

    public PaymentStatus PaymentStatus { get; private set; } = paymentStatus;

    public string? Remarks { get; private set; } = remarks;

    public DateTime? PaidAt { get; private set; }

    public bool EmailSent { get; private set; }

    public DateTime? EmailSentAt { get; private set; }

    public virtual Vehicle? Vehicle { get; set; }

    public virtual User? Staff { get; set; }

    public virtual ICollection<SalesInvoiceItem>? Items { get; set; }

    public void MarkAsPaid()
    {
        PaymentStatus = PaymentStatus.Paid;
        AmountPaid = TotalAmount;
        BalanceDue = 0;
        PaidAt = DateTime.Now;
    }

    public void RecordPayment(decimal amountPaid)
    {
        AmountPaid = amountPaid;
        BalanceDue = TotalAmount - AmountPaid;
        PaymentStatus = BalanceDue <= 0 ? PaymentStatus.Paid : PaymentStatus.PartiallyPaid;
        if (PaymentStatus == PaymentStatus.Paid) PaidAt = DateTime.Now;
    }

    public void MarkAsCredit(DateTime creditDueDate, decimal amountPaid = 0)
    {
        CreditDueDate = creditDueDate;
        RecordPayment(amountPaid);
        if (BalanceDue > 0 && PaymentStatus != PaymentStatus.PartiallyPaid)
        {
            PaymentStatus = PaymentStatus.Unpaid;
        }
    }

    public void MarkCreditReminderSent()
    {
        LastCreditReminderSentAt = DateTime.Now;
    }

    public void MarkEmailSent()
    {
        EmailSent = true;
        EmailSentAt = DateTime.Now;
    }
}

using GearVault.Application.DTOs.Base;
using GearVault.Domain.Common.Enum;

namespace GearVault.Application.DTOs.SalesInvoices;

public class SalesInvoiceDto : BaseDto
{
    public string InvoiceNumber { get; set; } = string.Empty;

    public Guid CustomerId { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public string CustomerPhone { get; set; } = string.Empty;

    public string? CustomerEmail { get; set; }

    public Guid? VehicleId { get; set; }

    public string? VehicleNumber { get; set; }

    public Guid StaffId { get; set; }

    public string? StaffName { get; set; }

    public decimal SubTotal { get; set; }

    public decimal DiscountAmount { get; set; }

    public decimal TotalAmount { get; set; }

    public PaymentStatus PaymentStatus { get; set; }

    public string? Remarks { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? PaidAt { get; set; }

    public bool EmailSent { get; set; }

    public DateTime? EmailSentAt { get; set; }

    public List<SalesInvoiceItemDto> Items { get; set; } = new();
}

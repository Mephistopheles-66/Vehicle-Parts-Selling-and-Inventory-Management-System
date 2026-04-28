using GearVault.Domain.Common.Enum;

namespace GearVault.Application.DTOs.SalesInvoices;

public class CreateSalesInvoiceDto
{
    public Guid CustomerId { get; set; }

    public Guid? VehicleId { get; set; }

    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Paid;

    public string? Remarks { get; set; }

    public bool SendEmail { get; set; } = true;

    public List<CreateSalesInvoiceItemDto> Items { get; set; } = new();
}

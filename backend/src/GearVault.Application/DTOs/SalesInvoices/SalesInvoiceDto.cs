using GearVault.Application.DTOs.Base;
using GearVault.Application.DTOs.Users;
using GearVault.Application.DTOs.Vehicles;
using GearVault.Domain.Common.Enum;

namespace GearVault.Application.DTOs.SalesInvoices;

public class SalesInvoiceDto : BaseDto
{
    public string InvoiceNumber { get; set; } = string.Empty;

    public UserDto Customer { get; set; } = new();

    public VehicleDto Vehicle { get; set; } = new();

    public UserDto Staff { get; set; } = new();

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

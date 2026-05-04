using GearVault.Domain.Entities;
using GearVault.Application.DTOs.Parts;
using GearVault.Application.DTOs.Users;
using GearVault.Application.DTOs.Vehicles;

namespace GearVault.Application.DTOs.SalesInvoices;

public static class SalesInvoiceExtensionMethods
{
    public static SalesInvoiceItemDto ToSalesInvoiceItemDto(this SalesInvoiceItem item, Part? part = null)
    {
        return new SalesInvoiceItemDto
        {
            Id = item.Id,
            SalesInvoiceId = item.SalesInvoiceId,
            Part = (part ?? item.Part)?.ToPartDto() ?? new(),
            Quantity = item.Quantity,
            UnitPrice = item.UnitPrice,
            LineTotal = item.LineTotal,
            IsActive = item.IsActive
        };
    }

    public static SalesInvoiceDto ToSalesInvoiceDto(
        this SalesInvoice invoice,
        User user,
        Vehicle vehicle,
        User? staff,
        IEnumerable<SalesInvoiceItem>? items = null)
    {
        return new SalesInvoiceDto
        {
            Id = invoice.Id,
            InvoiceNumber = invoice.InvoiceNumber,
            Customer = user.ToUserDto(),
            Vehicle = vehicle.ToVehicleDto(user),
            Staff = staff?.ToUserDto() ?? new(),
            SubTotal = invoice.SubTotal,
            DiscountAmount = invoice.DiscountAmount,
            TotalAmount = invoice.TotalAmount,
            PaymentStatus = invoice.PaymentStatus,
            Remarks = invoice.Remarks,
            CreatedAt = invoice.CreatedAt,
            PaidAt = invoice.PaidAt,
            EmailSent = invoice.EmailSent,
            EmailSentAt = invoice.EmailSentAt,
            IsActive = invoice.IsActive,
            Items = (items ?? invoice.Items ?? Enumerable.Empty<SalesInvoiceItem>())
                .Select(i => i.ToSalesInvoiceItemDto())
                .ToList()
        };
    }
}

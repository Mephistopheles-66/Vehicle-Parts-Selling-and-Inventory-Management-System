using GearVault.Domain.Entities;

namespace GearVault.Application.DTOs.SalesInvoices;

public static class SalesInvoiceExtensionMethods
{
    public static SalesInvoiceItemDto ToSalesInvoiceItemDto(this SalesInvoiceItem item)
    {
        return new SalesInvoiceItemDto
        {
            Id = item.Id,
            SalesInvoiceId = item.SalesInvoiceId,
            PartId = item.PartId,
            PartName = item.PartName,
            Quantity = item.Quantity,
            UnitPrice = item.UnitPrice,
            LineTotal = item.LineTotal,
            IsActive = item.IsActive
        };
    }

    public static SalesInvoiceDto ToSalesInvoiceDto(
        this SalesInvoice invoice,
        Customer customer,
        Vehicle? vehicle,
        User? staff,
        IEnumerable<SalesInvoiceItem>? items = null)
    {
        return new SalesInvoiceDto
        {
            Id = invoice.Id,
            InvoiceNumber = invoice.InvoiceNumber,
            CustomerId = invoice.CustomerId,
            CustomerName = customer.FullName,
            CustomerPhone = customer.PhoneNumber,
            CustomerEmail = customer.EmailAddress,
            VehicleId = invoice.VehicleId,
            VehicleNumber = vehicle?.VehicleNumber,
            StaffId = invoice.StaffId,
            StaffName = staff?.Name,
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

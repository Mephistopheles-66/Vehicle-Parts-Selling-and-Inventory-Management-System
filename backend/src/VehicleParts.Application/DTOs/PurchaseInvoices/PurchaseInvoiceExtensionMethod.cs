using VehicleParts.Domain.Entities;

namespace VehicleParts.Application.DTOs.PurchaseInvoices;

public static class PurchaseInvoiceExtensionMethod
{
    public static PurchaseInvoiceDto ToPurchaseInvoiceDto(this PurchaseInvoice invoice)
    {
        return new PurchaseInvoiceDto
        {
            Id = invoice.Id,
            VendorId = invoice.VendorId,
            VendorName = invoice.Vendor?.Name ?? string.Empty,
            InvoiceNo = invoice.InvoiceNo,
            InvoiceDate = invoice.InvoiceDate,
            DueDate = invoice.DueDate,
            Status = invoice.Status.ToString().ToUpper(),
            LineItems = invoice.LineItems.Select(li => li.ToLineItemDto()).ToList(),
            Subtotal = invoice.Subtotal,
            Discount = invoice.Discount,
            TaxAmount = invoice.TaxAmount,
            GrandTotal = invoice.GrandTotal,
            AmountPaid = invoice.AmountPaid,
            BalanceDue = invoice.BalanceDue,
            CreatedAt = invoice.CreatedAt,
            UpdatedAt = invoice.UpdatedAt
        };
    }

    public static PurchaseInvoiceLineItemDto ToLineItemDto(this PurchaseInvoiceLineItem lineItem)
    {
        return new PurchaseInvoiceLineItemDto
        {
            Id = lineItem.Id,
            PartId = lineItem.PartId,
            PartName = lineItem.Part?.Name ?? string.Empty,
            PartNumber = lineItem.Part?.PartNumber ?? string.Empty,
            Quantity = lineItem.Quantity,
            UnitPrice = lineItem.UnitPrice,
            Total = lineItem.Total
        };
    }
}

using GearVault.Domain.Entities;
using GearVault.Application.DTOs.Parts;
using GearVault.Application.DTOs.Vendors;

namespace GearVault.Application.DTOs.PurchaseInvoices;

public static class PurchaseInvoiceExtensionMethod
{
    public static PurchaseInvoiceDto ToPurchaseInvoiceDto(this PurchaseInvoice invoice)
    {
        return new PurchaseInvoiceDto
        {
            Id = invoice.Id,
            Vendor = invoice.Vendor?.ToVendorDto() ?? new(),
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
            Part = lineItem.Part?.ToPartDto() ?? new(),
            Quantity = lineItem.Quantity,
            UnitPrice = lineItem.UnitPrice,
            Total = lineItem.Total
        };
    }
}

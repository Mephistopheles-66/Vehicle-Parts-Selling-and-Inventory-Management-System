using GearVault.Domain.Entities;
using GearVault.Application.DTOs.Parts;
using GearVault.Application.DTOs.Vendors;

namespace GearVault.Application.DTOs.PurchaseInvoices;

public static class PurchaseInvoiceExtensionMethod
{
    public static PurchaseInvoiceDto ToPurchaseInvoiceDto(this PurchaseInvoice invoice)
    {
        // Always compute from Quantity * UnitPrice — the Total column may be stale/zero for old records
        var subtotal = invoice.LineItems.Sum(li => (decimal)li.Quantity * li.UnitPrice);
        var grandTotal = subtotal - invoice.Discount + invoice.TaxAmount;
        var balanceDue = grandTotal - invoice.AmountPaid;

        return new PurchaseInvoiceDto
        {
            Id = invoice.Id,
            Vendor = invoice.Vendor?.ToVendorDto() ?? new(),
            InvoiceNo = invoice.InvoiceNo,
            InvoiceDate = invoice.InvoiceDate,
            DueDate = invoice.DueDate,
            Status = invoice.Status.ToString().ToUpper(),
            LineItems = invoice.LineItems.Select(li => li.ToLineItemDto()).ToList(),
            Subtotal = subtotal,
            Discount = invoice.Discount,
            TaxAmount = invoice.TaxAmount,
            GrandTotal = grandTotal,
            AmountPaid = invoice.AmountPaid,
            BalanceDue = balanceDue,
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
            Total = (decimal)lineItem.Quantity * lineItem.UnitPrice
        };
    }
}

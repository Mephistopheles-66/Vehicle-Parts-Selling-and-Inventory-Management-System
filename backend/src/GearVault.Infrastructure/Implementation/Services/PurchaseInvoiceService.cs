using GearVault.Domain.Entities;
using GearVault.Domain.Common.Enum;
using GearVault.Application.DTOs.PurchaseInvoices;
using GearVault.Application.Exceptions;
using GearVault.Application.Interfaces.Services;
using GearVault.Application.Interfaces.Repositories;

namespace GearVault.Infrastructure.Implementation.Services;

public class PurchaseInvoiceService(IGenericRepository genericRepository) : IPurchaseInvoiceService
{
    public List<PurchaseInvoiceDto> GetAllPurchaseInvoices()
    {
        var invoices = genericRepository.Get<PurchaseInvoice>(
            asNoTracking: true,
            includeProperties: "Vendor,LineItems,LineItems.Part"
        ).ToList();

        return invoices.ConvertAll(x => x.ToPurchaseInvoiceDto());
    }

    public PurchaseInvoiceDto GetPurchaseInvoiceById(Guid invoiceId)
    {
        var invoice = genericRepository.GetById<PurchaseInvoice>(
            invoiceId,
            asNoTracking: true,
            includeProperties: "Vendor,LineItems,LineItems.Part"
        ) ?? throw new NotFoundException("Purchase invoice not found.");

        return invoice.ToPurchaseInvoiceDto();
    }

    public PurchaseInvoiceDto CreatePurchaseInvoice(CreatePurchaseInvoiceDto dto)
    {
        if (!genericRepository.Exists<Vendor>(v => v.Id == dto.VendorId))
            throw new BadRequestException("Vendor not found.");

        if (genericRepository.Exists<PurchaseInvoice>(i => i.InvoiceNo == dto.InvoiceNo))
            throw new BadRequestException("An invoice with this number already exists.");

        if (dto.LineItems.Count == 0)
            throw new BadRequestException("At least one line item is required.");

        var invoice = new PurchaseInvoice(
            dto.VendorId,
            dto.InvoiceNo,
            dto.InvoiceDate,
            dto.DueDate,
            dto.Discount,
            dto.TaxAmount,
            dto.AmountPaid
        );

        // Assign ID upfront so line items get the correct FK
        invoice.AssignIdentifier(Guid.NewGuid());

        foreach (var li in dto.LineItems)
        {
            if (!genericRepository.Exists<Part>(p => p.Id == li.PartId))
                throw new BadRequestException($"Part with ID {li.PartId} not found.");

            invoice.LineItems.Add(new PurchaseInvoiceLineItem(
                invoice.Id,
                li.PartId,
                li.Quantity,
                li.UnitPrice
            ));
        }

        // Calculate totals before persisting
        invoice.RecalculateTotals();

        // Single insert — EF Core cascades the line items
        genericRepository.Insert(invoice);

        return GetPurchaseInvoiceById(invoice.Id);
    }

    public PurchaseInvoiceDto PostInvoice(Guid invoiceId)
    {
        var invoice = genericRepository.GetById<PurchaseInvoice>(
            invoiceId,
            includeProperties: "LineItems,LineItems.Part"
        ) ?? throw new NotFoundException("Purchase invoice not found.");

        if (invoice.Status != InvoiceStatus.Draft)
            throw new BadRequestException("Only draft invoices can be posted.");

        foreach (var lineItem in invoice.LineItems)
        {
            var part = genericRepository.GetById<Part>(lineItem.PartId)
                       ?? throw new NotFoundException($"Part not found for line item.");

            part.AdjustStock(lineItem.Quantity);
            genericRepository.Update(part);
        }

        invoice.RecalculateTotals();
        invoice.Post();
        genericRepository.Update(invoice);

        return GetPurchaseInvoiceById(invoiceId);
    }

    public PurchaseInvoiceDto CancelInvoice(Guid invoiceId)
    {
        var invoice = genericRepository.GetById<PurchaseInvoice>(
            invoiceId,
            includeProperties: "LineItems"
        ) ?? throw new NotFoundException("Purchase invoice not found.");

        if (invoice.Status == InvoiceStatus.Cancelled)
            throw new BadRequestException("Invoice is already cancelled.");

        if (invoice.Status == InvoiceStatus.Posted)
        {
            foreach (var lineItem in invoice.LineItems)
            {
                var part = genericRepository.GetById<Part>(lineItem.PartId)
                           ?? throw new NotFoundException("Part not found for line item.");

                part.AdjustStock(-lineItem.Quantity);
                genericRepository.Update(part);
            }
        }

        invoice.Cancel();
        genericRepository.Update(invoice);

        return GetPurchaseInvoiceById(invoiceId);
    }
}

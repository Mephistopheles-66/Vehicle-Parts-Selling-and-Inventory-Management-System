using GearVault.Application.DTOs.PurchaseInvoices;
using GearVault.Application.Common.Service;

namespace GearVault.Application.Interfaces.Services;

public interface IPurchaseInvoiceService : ITransientService
{
    List<PurchaseInvoiceDto> GetAllPurchaseInvoices();

    PurchaseInvoiceDto GetPurchaseInvoiceById(Guid invoiceId);

    PurchaseInvoiceDto CreatePurchaseInvoice(CreatePurchaseInvoiceDto dto);

    PurchaseInvoiceDto PostInvoice(Guid invoiceId);

    PurchaseInvoiceDto CancelInvoice(Guid invoiceId);
}

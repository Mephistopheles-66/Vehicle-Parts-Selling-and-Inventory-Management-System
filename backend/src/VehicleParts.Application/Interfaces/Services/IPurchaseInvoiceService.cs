using VehicleParts.Application.DTOs.PurchaseInvoices;
using VehicleParts.Application.Common.Service;

namespace VehicleParts.Application.Interfaces.Services;

public interface IPurchaseInvoiceService : ITransientService
{
    List<PurchaseInvoiceDto> GetAllPurchaseInvoices();

    PurchaseInvoiceDto GetPurchaseInvoiceById(Guid invoiceId);

    PurchaseInvoiceDto CreatePurchaseInvoice(CreatePurchaseInvoiceDto dto);

    PurchaseInvoiceDto PostInvoice(Guid invoiceId);

    PurchaseInvoiceDto CancelInvoice(Guid invoiceId);
}

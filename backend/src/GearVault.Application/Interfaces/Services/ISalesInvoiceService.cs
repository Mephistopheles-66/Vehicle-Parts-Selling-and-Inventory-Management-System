using GearVault.Application.Common.Service;
using GearVault.Application.DTOs.SalesInvoices;

namespace GearVault.Application.Interfaces.Services;

public interface ISalesInvoiceService : ITransientService
{
    List<SalesInvoiceDto> GetAllInvoices(
        int pageNumber,
        int pageSize,
        out int rowCount,
        string? globalSearch = null,
        Guid? userId = null,
        string[]? orderBys = null);

    SalesInvoiceDto GetInvoiceById(Guid invoiceId);

    /// <summary>
    /// Creates a sales invoice. Validates stock, snapshots part prices,
    /// applies the 10% loyalty discount when subtotal > 5000,
    /// decrements part stock atomically, and optionally queues an email.
    /// </summary>
    Guid CreateInvoice(CreateSalesInvoiceDto dto);

    /// <summary>
    /// Queues an invoice email through the EmailOutbox so the existing
    /// background sender picks it up. Re-sendable.
    /// </summary>
    void SendInvoiceEmail(Guid invoiceId);
}

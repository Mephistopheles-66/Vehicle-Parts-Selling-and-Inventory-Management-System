using System.Text.Json;
using GearVault.Domain.Entities;
using GearVault.Domain.Common.Enum;
using GearVault.Application.Common.User;
using GearVault.Application.Exceptions;
using GearVault.Application.DTOs.SalesInvoices;
using GearVault.Application.Interfaces.Services;
using GearVault.Application.Interfaces.Repositories;

namespace GearVault.Infrastructure.Implementation.Services;

public class SalesInvoiceService(
    IGenericRepository genericRepository,
    IApplicationUserService applicationUserService) : ISalesInvoiceService
{
    // Loyalty: 10% discount when subtotal of a single purchase exceeds this threshold.
    private const decimal LoyaltyThreshold = 5000m;
    private const decimal LoyaltyDiscountRate = 0.10m;

    #region Read
    public List<SalesInvoiceDto> GetAllInvoices(
        int pageNumber,
        int pageSize,
        out int rowCount,
        string? globalSearch = null,
        Guid? customerId = null,
        string[]? orderBys = null)
    {
        var invoices = genericRepository.GetPagedResult<SalesInvoice>(
            pageNumber,
            pageSize,
            out rowCount,
            x =>
                (string.IsNullOrEmpty(globalSearch)
                    || x.InvoiceNumber.ToLower().Contains(globalSearch.ToLower())) &&
                (customerId == null || x.CustomerId == customerId.Value),
            orderBys ?? new[] { "CreatedAt desc" }).ToList();

        if (invoices.Count == 0) return new List<SalesInvoiceDto>();

        return HydrateInvoices(invoices);
    }

    public SalesInvoiceDto GetInvoiceById(Guid invoiceId)
    {
        var invoice = genericRepository.GetById<SalesInvoice>(invoiceId)
            ?? throw new NotFoundException($"Invoice with identifier '{invoiceId}' was not found.");

        return HydrateInvoices(new List<SalesInvoice> { invoice }).Single();
    }
    #endregion

    #region Create
    public Guid CreateInvoice(CreateSalesInvoiceDto dto)
    {
        if (dto.Items == null || dto.Items.Count == 0)
            throw new BadRequestException("Invoice must contain at least one item.");

        if (dto.Items.Any(i => i.Quantity <= 0))
            throw new BadRequestException("All item quantities must be greater than zero.");

        // 1. Validate customer.
        var customer = genericRepository.GetById<Customer>(dto.CustomerId)
            ?? throw new NotFoundException($"Customer with identifier '{dto.CustomerId}' was not found.");

        // 2. Validate vehicle (if specified) belongs to the customer.
        if (dto.VehicleId.HasValue)
        {
            var vehicle = genericRepository.GetById<Vehicle>(dto.VehicleId.Value)
                ?? throw new NotFoundException($"Vehicle with identifier '{dto.VehicleId}' was not found.");

            if (vehicle.CustomerId != customer.Id)
                throw new BadRequestException("The selected vehicle does not belong to the specified customer.");
        }

        // 3. Resolve staff (current authenticated user).
        if (!applicationUserService.IsAuthenticated)
            throw new UnauthorizedException("Cannot create an invoice without an authenticated staff user.");

        var staffId = applicationUserService.GetUserId;

        // 4. Load all parts referenced in this invoice.
        var partIds = dto.Items.Select(i => i.PartId).Distinct().ToList();
        var parts = genericRepository.Get<Part>(p => partIds.Contains(p.Id))
            .ToDictionary(p => p.Id, p => p);

        if (parts.Count != partIds.Count)
        {
            var missing = partIds.Except(parts.Keys);
            throw new NotFoundException($"Parts not found: {string.Join(", ", missing)}.");
        }

        // 5. Validate stock and build invoice line snapshots.
        var lineSnapshots = new List<(Guid PartId, string Name, int Quantity, decimal UnitPrice, decimal LineTotal)>();
        decimal subTotal = 0m;

        foreach (var requestedItem in dto.Items)
        {
            var part = parts[requestedItem.PartId];

            if (!part.IsActive)
                throw new BadRequestException($"Part '{part.Name}' is inactive and cannot be sold.");

            if (part.StockQty < requestedItem.Quantity)
                throw new BadRequestException(
                    $"Insufficient stock for part '{part.Name}'. Available: {part.StockQty}, Requested: {requestedItem.Quantity}.");

            var lineTotal = part.SellingPrice * requestedItem.Quantity;
            subTotal += lineTotal;

            lineSnapshots.Add((part.Id, part.Name, requestedItem.Quantity, part.SellingPrice, lineTotal));
        }

        // 6. Apply loyalty discount (10% off when subtotal > 5000).
        var discount = subTotal > LoyaltyThreshold
            ? Math.Round(subTotal * LoyaltyDiscountRate, 2)
            : 0m;
        var totalAmount = subTotal - discount;

        // 7. Persist invoice + items.
        var invoice = new SalesInvoice(
            invoiceNumber: GenerateInvoiceNumber(),
            customerId: customer.Id,
            vehicleId: dto.VehicleId,
            staffId: staffId,
            subTotal: subTotal,
            discountAmount: discount,
            totalAmount: totalAmount,
            paymentStatus: dto.PaymentStatus,
            remarks: dto.Remarks);

        if (dto.PaymentStatus == PaymentStatus.Paid)
            invoice.MarkAsPaid();

        var invoiceId = genericRepository.Insert(invoice);

        var itemEntities = lineSnapshots.Select(line => new SalesInvoiceItem(
            invoiceId,
            line.PartId,
            line.Name,
            line.Quantity,
            line.UnitPrice,
            line.LineTotal
        )).ToList();

        genericRepository.AddMultipleEntity(itemEntities);

        // 8. Decrement stock — AdjustStock takes a delta, so pass NEGATIVE for sales.
        foreach (var requestedItem in dto.Items)
        {
            var part = parts[requestedItem.PartId];
            part.AdjustStock(-requestedItem.Quantity);
            genericRepository.Update(part);
        }

        // 9. Queue email if requested and customer has an email address.
        if (dto.SendEmail && !string.IsNullOrWhiteSpace(customer.EmailAddress))
        {
            QueueInvoiceEmail(invoice, customer);
            invoice.MarkEmailSent();
            genericRepository.Update(invoice);
        }

        return invoiceId;
    }

    public void SendInvoiceEmail(Guid invoiceId)
    {
        var invoice = genericRepository.GetById<SalesInvoice>(invoiceId)
            ?? throw new NotFoundException($"Invoice with identifier '{invoiceId}' was not found.");

        var customer = genericRepository.GetById<Customer>(invoice.CustomerId)
            ?? throw new NotFoundException("Customer for this invoice was not found.");

        if (string.IsNullOrWhiteSpace(customer.EmailAddress))
            throw new BadRequestException("Customer does not have an email address on file.");

        QueueInvoiceEmail(invoice, customer);

        invoice.MarkEmailSent();
        genericRepository.Update(invoice);
    }
    #endregion

    #region Helpers — Hydration
    private List<SalesInvoiceDto> HydrateInvoices(List<SalesInvoice> invoices)
    {
        var customerIds = invoices.Select(i => i.CustomerId).Distinct().ToHashSet();
        var vehicleIds = invoices.Where(i => i.VehicleId.HasValue).Select(i => i.VehicleId!.Value).Distinct().ToHashSet();
        var staffIds = invoices.Select(i => i.StaffId).Distinct().ToHashSet();
        var invoiceIds = invoices.Select(i => i.Id).ToHashSet();

        var customers = genericRepository.Get<Customer>(c => customerIds.Contains(c.Id))
            .ToDictionary(c => c.Id, c => c);

        var vehicles = vehicleIds.Count > 0
            ? genericRepository.Get<Vehicle>(v => vehicleIds.Contains(v.Id)).ToDictionary(v => v.Id, v => v)
            : new Dictionary<Guid, Vehicle>();

        var staff = genericRepository.Get<User>(u => staffIds.Contains(u.Id))
            .ToDictionary(u => u.Id, u => u);

        var items = genericRepository.Get<SalesInvoiceItem>(i => invoiceIds.Contains(i.SalesInvoiceId))
            .GroupBy(i => i.SalesInvoiceId)
            .ToDictionary(g => g.Key, g => g.ToList());

        return invoices.Select(invoice =>
        {
            if (!customers.TryGetValue(invoice.CustomerId, out var customer))
                throw new NotFoundException($"Customer for invoice '{invoice.InvoiceNumber}' is missing.");

            Vehicle? vehicle = null;
            if (invoice.VehicleId.HasValue)
                vehicles.TryGetValue(invoice.VehicleId.Value, out vehicle);

            staff.TryGetValue(invoice.StaffId, out var staffUser);

            var invoiceItems = items.GetValueOrDefault(invoice.Id) ?? new List<SalesInvoiceItem>();

            return invoice.ToSalesInvoiceDto(customer, vehicle, staffUser, invoiceItems);
        }).ToList();
    }
    #endregion

    #region Helpers — Invoice Numbering
    private string GenerateInvoiceNumber()
    {
        // Format: INV-YYYYMMDD-XXXX where XXXX is a daily sequence.
        var today = DateTime.Now.Date;
        var tomorrow = today.AddDays(1);

        var todayCount = genericRepository.GetCount<SalesInvoice>(
            x => x.CreatedAt >= today && x.CreatedAt < tomorrow);

        var sequence = (todayCount + 1).ToString("D4");
        return $"INV-{today:yyyyMMdd}-{sequence}";
    }
    #endregion

    #region Helpers — Email
    private void QueueInvoiceEmail(SalesInvoice invoice, Customer customer)
    {
        if (string.IsNullOrWhiteSpace(customer.EmailAddress)) return;

        var payload = new
        {
            InvoiceId = invoice.Id,
            InvoiceNumber = invoice.InvoiceNumber,
            CustomerName = customer.FullName,
            SubTotal = invoice.SubTotal,
            DiscountAmount = invoice.DiscountAmount,
            TotalAmount = invoice.TotalAmount,
            CreatedAt = invoice.CreatedAt
        };

        var outbox = new EmailOutbox(
            toEmail: customer.EmailAddress,
            name: customer.FullName,
            subject: $"Your Invoice {invoice.InvoiceNumber}",
            process: EmailProcess.SalesInvoiceCreated,
            payloadJson: JsonSerializer.Serialize(payload));

        genericRepository.Insert(outbox);
    }
    #endregion
}
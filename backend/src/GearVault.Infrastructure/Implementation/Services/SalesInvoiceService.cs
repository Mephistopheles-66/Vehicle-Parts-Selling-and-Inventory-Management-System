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
        Guid? userId = null,
        string[]? orderBys = null)
    {
        var invoices = genericRepository.GetPagedResult<SalesInvoice>(
            pageNumber,
            pageSize,
            out rowCount,
            x =>
                (string.IsNullOrEmpty(globalSearch)
                    || x.InvoiceNumber.ToLower().Contains(globalSearch.ToLower())) &&
                (userId == null || x.Vehicle!.UserId == userId.Value),
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

        // 1. Validate vehicle and owner user.
        var vehicle = genericRepository.GetById<Vehicle>(dto.VehicleId)
            ?? throw new NotFoundException($"Vehicle with identifier '{dto.VehicleId}' was not found.");

        var user = genericRepository.GetById<User>(vehicle.UserId)
            ?? throw new NotFoundException($"User with identifier '{vehicle.UserId}' was not found.");

        // 2. Resolve staff (current authenticated user).
        if (!applicationUserService.IsAuthenticated)
            throw new UnauthorizedException("Cannot create an invoice without an authenticated staff user.");

        var staffId = applicationUserService.GetUserId;

        // 3. Load all parts referenced in this invoice.
        var partIds = dto.Items.Select(i => i.PartId).Distinct().ToList();
        var parts = genericRepository.Get<Part>(p => partIds.Contains(p.Id))
            .ToDictionary(p => p.Id, p => p);

        if (parts.Count != partIds.Count)
        {
            var missing = partIds.Except(parts.Keys);
            throw new NotFoundException($"Parts not found: {string.Join(", ", missing)}.");
        }

        // 4. Validate stock and build invoice line snapshots.
        var lineSnapshots = new List<(Guid PartId, int Quantity, decimal UnitPrice, decimal LineTotal)>();
        decimal subTotal = 0m;

        foreach (var requestedItem in dto.Items)
        {
            var part = parts[requestedItem.PartId];

            if (!part.IsActive)
                throw new BadRequestException($"Part '{part.Name}' is inactive and cannot be sold.");

            if (part.StockQuantity < requestedItem.Quantity)
                throw new BadRequestException(
                    $"Insufficient stock for part '{part.Name}'. Available: {part.StockQuantity}, Requested: {requestedItem.Quantity}.");

            var lineTotal = part.SellingPrice * requestedItem.Quantity;
            subTotal += lineTotal;

            lineSnapshots.Add((part.Id, requestedItem.Quantity, part.SellingPrice, lineTotal));
        }

        // 5. Apply loyalty discount (10% off when subtotal > 5000).
        var discount = subTotal > LoyaltyThreshold
            ? Math.Round(subTotal * LoyaltyDiscountRate, 2)
            : 0m;
        var totalAmount = subTotal - discount;

        // 6. Persist invoice + items.
        var invoice = new SalesInvoice(
            invoiceNumber: GenerateInvoiceNumber(),
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
            line.Quantity,
            line.UnitPrice,
            line.LineTotal
        )).ToList();

        genericRepository.AddMultipleEntity(itemEntities);

        // 7. Decrement stock. AdjustStock takes a delta, so pass negative for sales.
        foreach (var requestedItem in dto.Items)
        {
            var part = parts[requestedItem.PartId];
            part.AdjustStock(-requestedItem.Quantity);
            genericRepository.Update(part);
        }

        // 8. Queue email if requested and user has an email address.
        if (dto.SendEmail && !string.IsNullOrWhiteSpace(user.EmailAddress))
        {
            QueueInvoiceEmail(invoice, user);
            invoice.MarkEmailSent();
            genericRepository.Update(invoice);
        }

        return invoiceId;
    }

    public void SendInvoiceEmail(Guid invoiceId)
    {
        var invoice = genericRepository.GetById<SalesInvoice>(invoiceId)
            ?? throw new NotFoundException($"Invoice with identifier '{invoiceId}' was not found.");

        var vehicle = genericRepository.GetById<Vehicle>(invoice.VehicleId)
            ?? throw new NotFoundException("Vehicle for this invoice was not found.");

        var user = genericRepository.GetById<User>(vehicle.UserId)
            ?? throw new NotFoundException("User for this invoice was not found.");

        if (string.IsNullOrWhiteSpace(user.EmailAddress))
            throw new BadRequestException("User does not have an email address on file.");

        QueueInvoiceEmail(invoice, user);

        invoice.MarkEmailSent();
        genericRepository.Update(invoice);
    }
    #endregion

    #region Helpers — Hydration
    private List<SalesInvoiceDto> HydrateInvoices(List<SalesInvoice> invoices)
    {
        var vehicleIds = invoices.Select(i => i.VehicleId).Distinct().ToHashSet();
        var staffIds = invoices.Select(i => i.StaffId).Distinct().ToHashSet();
        var invoiceIds = invoices.Select(i => i.Id).ToHashSet();

        var vehicles = genericRepository.Get<Vehicle>(v => vehicleIds.Contains(v.Id))
            .ToDictionary(v => v.Id, v => v);

        var userIds = vehicles.Values.Select(v => v.UserId).Distinct().ToHashSet();

        var users = genericRepository.Get<User>(u => userIds.Contains(u.Id))
            .ToDictionary(u => u.Id, u => u);

        var staff = genericRepository.Get<User>(u => staffIds.Contains(u.Id))
            .ToDictionary(u => u.Id, u => u);

        var items = genericRepository.Get<SalesInvoiceItem>(i => invoiceIds.Contains(i.SalesInvoiceId))
            .GroupBy(i => i.SalesInvoiceId)
            .ToDictionary(g => g.Key, g => g.ToList());

        var partIds = items.Values
            .SelectMany(invoiceItems => invoiceItems)
            .Select(i => i.PartId)
            .Distinct()
            .ToHashSet();

        var parts = genericRepository.Get<Part>(p => partIds.Contains(p.Id))
            .ToDictionary(p => p.Id, p => p);

        return invoices.Select(invoice =>
        {
            if (!vehicles.TryGetValue(invoice.VehicleId, out var vehicle))
                throw new NotFoundException($"Vehicle for invoice '{invoice.InvoiceNumber}' is missing.");

            if (!users.TryGetValue(vehicle.UserId, out var user))
                throw new NotFoundException($"User for invoice '{invoice.InvoiceNumber}' is missing.");

            staff.TryGetValue(invoice.StaffId, out var staffUser);

            var invoiceItems = items.GetValueOrDefault(invoice.Id) ?? new List<SalesInvoiceItem>();
            foreach (var item in invoiceItems)
            {
                if (parts.TryGetValue(item.PartId, out var part))
                {
                    item.Part = part;
                }
            }

            return invoice.ToSalesInvoiceDto(user, vehicle, staffUser, invoiceItems);
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
    private void QueueInvoiceEmail(SalesInvoice invoice, User user)
    {
        if (string.IsNullOrWhiteSpace(user.EmailAddress)) return;

        var payload = new
        {
            InvoiceId = invoice.Id,
            InvoiceNumber = invoice.InvoiceNumber,
            UserName = user.Name,
            SubTotal = invoice.SubTotal,
            DiscountAmount = invoice.DiscountAmount,
            TotalAmount = invoice.TotalAmount,
            CreatedAt = invoice.CreatedAt
        };

        var outbox = new EmailOutbox(
            toEmail: user.EmailAddress,
            name: user.Name,
            subject: $"Your Invoice {invoice.InvoiceNumber}",
            process: EmailProcess.SalesInvoiceCreated,
            payloadJson: JsonSerializer.Serialize(payload));

        genericRepository.Insert(outbox);
    }
    #endregion
}

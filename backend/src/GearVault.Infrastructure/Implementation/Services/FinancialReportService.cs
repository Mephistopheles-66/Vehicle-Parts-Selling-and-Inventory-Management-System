using GearVault.Domain.Entities;
using GearVault.Domain.Common.Enum;
using GearVault.Application.DTOs.Reports;
using GearVault.Application.Interfaces.Services;
using GearVault.Application.Interfaces.Repositories;

namespace GearVault.Infrastructure.Implementation.Services;

public class FinancialReportService(IGenericRepository genericRepository) : IFinancialReportService
{
    public FinancialReportDto GetFinancialReport(ReportPeriod period, DateTime fromDate, DateTime toDate)
    {
        var toDateEnd = toDate.Date.AddDays(1);

        var salesInvoices = genericRepository.Get<SalesInvoice>(
            x => x.CreatedAt >= fromDate.Date && x.CreatedAt < toDateEnd,
            asNoTracking: true
        ).ToList();

        var purchaseInvoices = genericRepository.Get<PurchaseInvoice>(
            x => x.InvoiceDate >= fromDate.Date && x.InvoiceDate < toDateEnd
                 && x.Status == InvoiceStatus.Posted,
            asNoTracking: true
        ).ToList();

        var entries = BuildEntries(period, fromDate, toDate, salesInvoices, purchaseInvoices);

        return new FinancialReportDto
        {
            ReportType = period.ToString().ToUpper(),
            FromDate = fromDate.Date,
            ToDate = toDate.Date,
            TotalSalesRevenue = salesInvoices.Sum(x => x.TotalAmount),
            TotalPurchaseCost = purchaseInvoices.Sum(x => x.GrandTotal),
            TotalProfit = salesInvoices.Sum(x => x.TotalAmount) - purchaseInvoices.Sum(x => x.GrandTotal),
            TotalDiscounts = salesInvoices.Sum(x => x.DiscountAmount) + purchaseInvoices.Sum(x => x.Discount),
            TotalTax = purchaseInvoices.Sum(x => x.TaxAmount),
            TotalSalesInvoices = salesInvoices.Count,
            TotalPurchaseInvoices = purchaseInvoices.Count,
            Entries = entries
        };
    }

    private static List<FinancialReportEntryDto> BuildEntries(
        ReportPeriod period,
        DateTime fromDate,
        DateTime toDate,
        List<SalesInvoice> salesInvoices,
        List<PurchaseInvoice> purchaseInvoices)
    {
        var salesGroups = salesInvoices
            .GroupBy(x => GetPeriodKey(period, x.CreatedAt))
            .ToDictionary(g => g.Key, g => g.ToList());

        var purchaseGroups = purchaseInvoices
            .GroupBy(x => GetPeriodKey(period, x.InvoiceDate))
            .ToDictionary(g => g.Key, g => g.ToList());

        var allPeriodKeys = GeneratePeriodKeys(period, fromDate, toDate);

        return allPeriodKeys.Select(key =>
        {
            salesGroups.TryGetValue(key, out var sales);
            purchaseGroups.TryGetValue(key, out var purchases);

            var salesRevenue = sales?.Sum(x => x.TotalAmount) ?? 0;
            var purchaseCost = purchases?.Sum(x => x.GrandTotal) ?? 0;

            return new FinancialReportEntryDto
            {
                Period = key,
                TotalSalesRevenue = salesRevenue,
                TotalPurchaseCost = purchaseCost,
                TotalProfit = salesRevenue - purchaseCost,
                TotalDiscounts = (sales?.Sum(x => x.DiscountAmount) ?? 0) + (purchases?.Sum(x => x.Discount) ?? 0),
                TotalTax = purchases?.Sum(x => x.TaxAmount) ?? 0,
                SalesInvoiceCount = sales?.Count ?? 0,
                PurchaseInvoiceCount = purchases?.Count ?? 0
            };
        }).ToList();
    }

    private static string GetPeriodKey(ReportPeriod period, DateTime date) => period switch
    {
        ReportPeriod.Daily => date.ToString("yyyy-MM-dd"),
        ReportPeriod.Monthly => date.ToString("yyyy-MM"),
        ReportPeriod.Yearly => date.ToString("yyyy"),
        _ => date.ToString("yyyy-MM-dd")
    };

    private static List<string> GeneratePeriodKeys(ReportPeriod period, DateTime fromDate, DateTime toDate)
    {
        var keys = new List<string>();
        var current = fromDate.Date;

        while (current <= toDate.Date)
        {
            keys.Add(GetPeriodKey(period, current));

            current = period switch
            {
                ReportPeriod.Daily => current.AddDays(1),
                ReportPeriod.Monthly => current.AddMonths(1),
                ReportPeriod.Yearly => current.AddYears(1),
                _ => current.AddDays(1)
            };
        }

        return keys;
    }
}

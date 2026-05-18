namespace GearVault.Application.DTOs.Reports;

public class FinancialReportDto
{
    public string ReportType { get; set; } = string.Empty;

    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public decimal TotalSalesRevenue { get; set; }

    public decimal TotalPurchaseCost { get; set; }

    public decimal TotalProfit { get; set; }

    public decimal TotalDiscounts { get; set; }

    public decimal TotalTax { get; set; }

    public int TotalSalesInvoices { get; set; }

    public int TotalPurchaseInvoices { get; set; }

    public List<FinancialReportEntryDto> Entries { get; set; } = [];
}

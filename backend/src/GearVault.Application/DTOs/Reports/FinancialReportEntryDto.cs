namespace GearVault.Application.DTOs.Reports;

public class FinancialReportEntryDto
{
    public string Period { get; set; } = string.Empty;

    public decimal TotalSalesRevenue { get; set; }

    public decimal TotalPurchaseCost { get; set; }

    public decimal TotalProfit { get; set; }

    public decimal TotalDiscounts { get; set; }

    public decimal TotalTax { get; set; }

    public int SalesInvoiceCount { get; set; }

    public int PurchaseInvoiceCount { get; set; }
}

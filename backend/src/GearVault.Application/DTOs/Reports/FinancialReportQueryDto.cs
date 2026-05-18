namespace GearVault.Application.DTOs.Reports;

public class FinancialReportQueryDto
{
    public string Period { get; set; } = "monthly";

    public DateTime? From { get; set; }

    public DateTime? To { get; set; }
}

using GearVault.Application.Common.Service;
using GearVault.Application.DTOs.Reports;
using GearVault.Domain.Common.Enum;

namespace GearVault.Application.Interfaces.Services;

public interface IFinancialReportService : ITransientService
{
    FinancialReportDto GetFinancialReport(ReportPeriod period, DateTime fromDate, DateTime toDate);
}

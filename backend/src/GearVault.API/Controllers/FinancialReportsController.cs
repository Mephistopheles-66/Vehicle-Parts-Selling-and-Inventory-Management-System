using System.Net;
using Gridforce.Attributes;
using Microsoft.AspNetCore.Mvc;
using GearVault.API.Attributes;
using GearVault.Domain.Common.Enum;
using GearVault.Application.Common.Response;
using GearVault.Application.DTOs.Reports;
using GearVault.Application.Exceptions;
using GearVault.Application.Interfaces.Services;

namespace GearVault.API.Controllers;

[Authorize]
[ApiController]
[Route("api/financial-reports")]
public class FinancialReportsController(IFinancialReportService financialReportService) : ControllerBase
{
    [HttpGet]
    [Documentation("GetFinancialReport", "Generate a financial report for the specified period (daily, monthly, yearly).")]
    public ResponseDto<FinancialReportDto> GetFinancialReport([FromQuery] FinancialReportQueryDto query)
    {
        if (!Enum.TryParse<ReportPeriod>(query.Period, ignoreCase: true, out var period))
            throw new BadRequestException("Invalid report period. Accepted values: daily, monthly, yearly.");

        var fromDate = query.From ?? GetDefaultFromDate(period);
        var toDate = query.To ?? DateTime.Now;

        if (fromDate > toDate)
            throw new BadRequestException("'From' date cannot be after 'To' date.");

        var result = financialReportService.GetFinancialReport(period, fromDate, toDate);

        return new ResponseDto<FinancialReportDto>(
            (int)HttpStatusCode.OK,
            "Financial report generated successfully.",
            result);
    }

    private static DateTime GetDefaultFromDate(ReportPeriod period) => period switch
    {
        ReportPeriod.Daily => DateTime.Now.AddDays(-30),
        ReportPeriod.Monthly => DateTime.Now.AddMonths(-12),
        ReportPeriod.Yearly => DateTime.Now.AddYears(-5),
        _ => DateTime.Now.AddMonths(-12)
    };
}

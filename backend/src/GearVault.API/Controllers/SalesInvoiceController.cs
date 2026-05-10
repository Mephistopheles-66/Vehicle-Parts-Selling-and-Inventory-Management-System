using System.Net;
using Gridforce.Attributes;
using Microsoft.AspNetCore.Mvc;
using GearVault.API.Controllers.Base;
using GearVault.Application.Common.Response;
using GearVault.Application.DTOs.SalesInvoices;
using GearVault.Application.Interfaces.Services;

namespace GearVault.API.Controllers;

public class SalesInvoiceController(ISalesInvoiceService salesInvoiceService) : BaseController<SalesInvoiceController>
{
    [HttpGet]
    [Documentation("GetAllInvoices", "Retrieve all sales invoices with pagination.")]
    public CollectionDto<SalesInvoiceDto> GetAllInvoices(
        [FromQuery] PaginationQueryDto paginationQuery,
        [FromQuery] SearchAndActiveFlagQueryDto searchAndActiveFlagQuery,
        [FromQuery] OrderQueryDto orderQuery,
        [FromQuery] Guid? userId = null)
    {
        var result = salesInvoiceService.GetAllInvoices(
            paginationQuery.PageNumber,
            paginationQuery.PageSize,
            out var rowCount,
            searchAndActiveFlagQuery.GlobalSearch,
            userId,
            orderQuery.OrderBys);

        return new CollectionDto<SalesInvoiceDto>(
            (int)HttpStatusCode.OK,
            "Successfully fetched sales invoices.",
            result,
            rowCount,
            paginationQuery.PageNumber,
            paginationQuery.PageSize);
    }

    [HttpGet("{invoiceId:guid}")]
    [Documentation("GetInvoiceById", "Retrieve sales invoice details by identifier.")]
    public ResponseDto<SalesInvoiceDto> GetInvoiceById([FromRoute] Guid invoiceId)
    {
        var result = salesInvoiceService.GetInvoiceById(invoiceId);

        return new ResponseDto<SalesInvoiceDto>(
            (int)HttpStatusCode.OK,
            "Successfully fetched invoice details.",
            result);
    }

    [HttpPost]
    [Documentation("CreateInvoice", "Create a new sales invoice. Applies 10% loyalty discount when subtotal exceeds 5000.")]
    public ResponseDto<Guid> CreateInvoice([FromBody] CreateSalesInvoiceDto dto)
    {
        var invoiceId = salesInvoiceService.CreateInvoice(dto);

        return new ResponseDto<Guid>(
            (int)HttpStatusCode.OK,
            "Invoice created successfully.",
            invoiceId);
    }

    [HttpPost("{invoiceId:guid}/send-email")]
    [Documentation("SendInvoiceEmail", "Re-send the invoice email to the customer.")]
    public ResponseDto<bool> SendInvoiceEmail([FromRoute] Guid invoiceId)
    {
        salesInvoiceService.SendInvoiceEmail(invoiceId);

        return new ResponseDto<bool>(
            (int)HttpStatusCode.OK,
            "Invoice email queued successfully.",
            true);
    }
}

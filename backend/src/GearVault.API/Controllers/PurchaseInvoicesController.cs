using System.Net;
using Gridforce.Attributes;
using Microsoft.AspNetCore.Mvc;
using GearVault.API.Attributes;
using GearVault.Application.DTOs.PurchaseInvoices;
using GearVault.Application.Common.Response;
using GearVault.Application.Interfaces.Services;

namespace GearVault.API.Controllers;

[Authorize]
[ApiController]
[Route("api/purchase-invoices")]
public class PurchaseInvoicesController(IPurchaseInvoiceService purchaseInvoiceService) : ControllerBase
{
    [HttpGet]
    [Documentation("GetAllPurchaseInvoices", "Retrieve all purchase invoices.")]
    public ResponseDto<List<PurchaseInvoiceDto>> GetAllPurchaseInvoices()
    {
        var result = purchaseInvoiceService.GetAllPurchaseInvoices();
        return new ResponseDto<List<PurchaseInvoiceDto>>(
            (int)HttpStatusCode.OK,
            "Purchase invoices retrieved successfully.",
            result);
    }

    [HttpGet("{invoiceId:guid}")]
    [Documentation("GetPurchaseInvoiceById", "Retrieve a purchase invoice by identifier.")]
    public ResponseDto<PurchaseInvoiceDto> GetPurchaseInvoiceById([FromRoute] Guid invoiceId)
    {
        var result = purchaseInvoiceService.GetPurchaseInvoiceById(invoiceId);
        return new ResponseDto<PurchaseInvoiceDto>(
            (int)HttpStatusCode.OK,
            "Purchase invoice retrieved successfully.",
            result);
    }

    [HttpPost]
    [Documentation("CreatePurchaseInvoice", "Create a new purchase invoice.")]
    public ResponseDto<PurchaseInvoiceDto> CreatePurchaseInvoice([FromBody] CreatePurchaseInvoiceDto dto)
    {
        var result = purchaseInvoiceService.CreatePurchaseInvoice(dto);
        return new ResponseDto<PurchaseInvoiceDto>(
            (int)HttpStatusCode.Created,
            "Purchase invoice created successfully.",
            result);
    }

    [HttpPut("{invoiceId:guid}/post")]
    [Documentation("PostPurchaseInvoice", "Post a draft purchase invoice and update stock.")]
    public ResponseDto<PurchaseInvoiceDto> PostInvoice([FromRoute] Guid invoiceId)
    {
        var result = purchaseInvoiceService.PostInvoice(invoiceId);
        return new ResponseDto<PurchaseInvoiceDto>(
            (int)HttpStatusCode.OK,
            "Purchase invoice posted successfully.",
            result);
    }

    [HttpPut("{invoiceId:guid}/cancel")]
    [Documentation("CancelPurchaseInvoice", "Cancel a purchase invoice and reverse stock if posted.")]
    public ResponseDto<PurchaseInvoiceDto> CancelInvoice([FromRoute] Guid invoiceId)
    {
        var result = purchaseInvoiceService.CancelInvoice(invoiceId);
        return new ResponseDto<PurchaseInvoiceDto>(
            (int)HttpStatusCode.OK,
            "Purchase invoice cancelled successfully.",
            result);
    }
}

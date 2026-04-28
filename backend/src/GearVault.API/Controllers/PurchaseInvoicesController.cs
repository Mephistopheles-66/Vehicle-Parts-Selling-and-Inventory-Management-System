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
    public ActionResult<List<PurchaseInvoiceDto>> GetAllPurchaseInvoices()
    {
        var result = purchaseInvoiceService.GetAllPurchaseInvoices();
        return Ok(result);
    }

    [HttpGet("{invoiceId:guid}")]
    [Documentation("GetPurchaseInvoiceById", "Retrieve a purchase invoice by identifier.")]
    public ActionResult<PurchaseInvoiceDto> GetPurchaseInvoiceById([FromRoute] Guid invoiceId)
    {
        var result = purchaseInvoiceService.GetPurchaseInvoiceById(invoiceId);
        return Ok(result);
    }

    [HttpPost]
    [Documentation("CreatePurchaseInvoice", "Create a new purchase invoice.")]
    public ActionResult<PurchaseInvoiceDto> CreatePurchaseInvoice([FromBody] CreatePurchaseInvoiceDto dto)
    {
        var result = purchaseInvoiceService.CreatePurchaseInvoice(dto);
        return StatusCode((int)HttpStatusCode.Created, result);
    }

    [HttpPut("{invoiceId:guid}/post")]
    [Documentation("PostPurchaseInvoice", "Post a draft purchase invoice and update stock.")]
    public ActionResult<PurchaseInvoiceDto> PostInvoice([FromRoute] Guid invoiceId)
    {
        var result = purchaseInvoiceService.PostInvoice(invoiceId);
        return Ok(result);
    }

    [HttpPut("{invoiceId:guid}/cancel")]
    [Documentation("CancelPurchaseInvoice", "Cancel a purchase invoice and reverse stock if posted.")]
    public ActionResult<PurchaseInvoiceDto> CancelInvoice([FromRoute] Guid invoiceId)
    {
        var result = purchaseInvoiceService.CancelInvoice(invoiceId);
        return Ok(result);
    }
}

using System.Net;
using Gridforce.Attributes;
using Microsoft.AspNetCore.Mvc;
using GearVault.API.Attributes;
using GearVault.Application.DTOs.Vendors;
using GearVault.Application.Common.Response;
using GearVault.Application.Interfaces.Services;

namespace GearVault.API.Controllers;

[Authorize]
[ApiController]
[Route("api/vendors")]
public class VendorsController(IVendorService vendorService) : ControllerBase
{
    [HttpGet]
    [Documentation("GetAllVendors", "Retrieve all vendors.")]
    public ActionResult<List<VendorDto>> GetAllVendors()
    {
        var result = vendorService.GetAllVendors();
        return Ok(result);
    }

    [HttpGet("{vendorId:guid}")]
    [Documentation("GetVendorById", "Retrieve a vendor by identifier.")]
    public ActionResult<VendorDto> GetVendorById([FromRoute] Guid vendorId)
    {
        var result = vendorService.GetVendorById(vendorId);
        return Ok(result);
    }

    [HttpPost]
    [Documentation("CreateVendor", "Create a new vendor.")]
    public ActionResult<VendorDto> CreateVendor([FromBody] CreateVendorDto dto)
    {
        var result = vendorService.CreateVendor(dto);
        return StatusCode((int)HttpStatusCode.Created, result);
    }

    [HttpPut("{vendorId:guid}")]
    [Documentation("UpdateVendor", "Update an existing vendor.")]
    public ActionResult<VendorDto> UpdateVendor([FromRoute] Guid vendorId, [FromBody] UpdateVendorDto dto)
    {
        var result = vendorService.UpdateVendor(vendorId, dto);
        return Ok(result);
    }

    [HttpDelete("{vendorId:guid}")]
    [Documentation("DeleteVendor", "Delete a vendor.")]
    public ActionResult DeleteVendor([FromRoute] Guid vendorId)
    {
        vendorService.DeleteVendor(vendorId);
        return NoContent();
    }
}

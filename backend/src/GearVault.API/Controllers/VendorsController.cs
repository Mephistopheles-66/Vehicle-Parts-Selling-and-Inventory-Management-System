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
    public ResponseDto<List<VendorDto>> GetAllVendors()
    {
        var result = vendorService.GetAllVendors();
        return new ResponseDto<List<VendorDto>>(
            (int)HttpStatusCode.OK,
            "Vendors retrieved successfully.",
            result);
    }

    [HttpGet("{vendorId:guid}")]
    [Documentation("GetVendorById", "Retrieve a vendor by identifier.")]
    public ResponseDto<VendorDto> GetVendorById([FromRoute] Guid vendorId)
    {
        var result = vendorService.GetVendorById(vendorId);
        return new ResponseDto<VendorDto>(
            (int)HttpStatusCode.OK,
            "Vendor retrieved successfully.",
            result);
    }

    [HttpPost]
    [Documentation("CreateVendor", "Create a new vendor.")]
    public ResponseDto<VendorDto> CreateVendor([FromBody] CreateVendorDto dto)
    {
        var result = vendorService.CreateVendor(dto);
        return new ResponseDto<VendorDto>(
            (int)HttpStatusCode.Created,
            "Vendor created successfully.",
            result);
    }

    [HttpPut("{vendorId:guid}")]
    [Documentation("UpdateVendor", "Update an existing vendor.")]
    public ResponseDto<VendorDto> UpdateVendor([FromRoute] Guid vendorId, [FromBody] UpdateVendorDto dto)
    {
        var result = vendorService.UpdateVendor(vendorId, dto);
        return new ResponseDto<VendorDto>(
            (int)HttpStatusCode.OK,
            "Vendor updated successfully.",
            result);
    }

    [HttpDelete("{vendorId:guid}")]
    [Documentation("DeleteVendor", "Delete a vendor.")]
    public ResponseDto<bool> DeleteVendor([FromRoute] Guid vendorId)
    {
        vendorService.DeleteVendor(vendorId);
        return new ResponseDto<bool>(
            (int)HttpStatusCode.OK,
            "Vendor deleted successfully.",
            true);
    }
}

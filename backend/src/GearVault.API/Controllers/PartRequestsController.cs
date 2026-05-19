using System.Net;
using Gridforce.Attributes;
using Microsoft.AspNetCore.Mvc;
using GearVault.API.Attributes;
using GearVault.Application.Common.Response;
using GearVault.Application.DTOs.PartRequests;
using GearVault.Application.Interfaces.Services;

namespace GearVault.API.Controllers;

[Authorize]
[ApiController]
[Route("api/part-requests")]
public class PartRequestsController(IPartRequestService partRequestService) : ControllerBase
{
    [HttpGet("all")]
    [Documentation("GetAllPartRequests", "Retrieve all part requests. Staff and admin only.")]
    public ResponseDto<List<PartRequestDto>> GetAllPartRequests()
    {
        var result = partRequestService.GetAllPartRequests();
        return new ResponseDto<List<PartRequestDto>>(
            (int)HttpStatusCode.OK,
            "All part requests retrieved successfully.",
            result);
    }

    [HttpPut("{partRequestId:guid}/status")]
    [Documentation("UpdatePartRequestStatus", "Update the status of a part request. Staff and admin only.")]
    public ResponseDto<PartRequestDto> UpdatePartRequestStatus([FromRoute] Guid partRequestId, [FromBody] string status)
    {
        var result = partRequestService.UpdatePartRequestStatus(partRequestId, status);
        return new ResponseDto<PartRequestDto>(
            (int)HttpStatusCode.OK,
            "Part request status updated successfully.",
            result);
    }

    [HttpGet]
    [Documentation("GetMyPartRequests", "Retrieve all part requests submitted by the current user.")]
    public ResponseDto<List<PartRequestDto>> GetMyPartRequests()
    {
        var result = partRequestService.GetMyPartRequests();
        return new ResponseDto<List<PartRequestDto>>(
            (int)HttpStatusCode.OK,
            "Part requests retrieved successfully.",
            result);
    }

    [HttpGet("{partRequestId:guid}")]
    [Documentation("GetPartRequestById", "Retrieve a part request by identifier.")]
    public ResponseDto<PartRequestDto> GetPartRequestById([FromRoute] Guid partRequestId)
    {
        var result = partRequestService.GetPartRequestById(partRequestId);
        return new ResponseDto<PartRequestDto>(
            (int)HttpStatusCode.OK,
            "Part request retrieved successfully.",
            result);
    }

    [HttpPost]
    [Documentation("CreatePartRequest", "Submit a new part request.")]
    public ResponseDto<PartRequestDto> CreatePartRequest([FromBody] CreatePartRequestDto dto)
    {
        var result = partRequestService.CreatePartRequest(dto);
        return new ResponseDto<PartRequestDto>(
            (int)HttpStatusCode.Created,
            "Part request created successfully.",
            result);
    }

    [HttpPut("{partRequestId:guid}")]
    [Documentation("UpdatePartRequest", "Update an existing part request.")]
    public ResponseDto<PartRequestDto> UpdatePartRequest([FromRoute] Guid partRequestId, [FromBody] UpdatePartRequestDto dto)
    {
        var result = partRequestService.UpdatePartRequest(partRequestId, dto);
        return new ResponseDto<PartRequestDto>(
            (int)HttpStatusCode.OK,
            "Part request updated successfully.",
            result);
    }

    [HttpDelete("{partRequestId:guid}")]
    [Documentation("DeletePartRequest", "Delete a part request.")]
    public ResponseDto<bool> DeletePartRequest([FromRoute] Guid partRequestId)
    {
        partRequestService.DeletePartRequest(partRequestId);
        return new ResponseDto<bool>(
            (int)HttpStatusCode.OK,
            "Part request deleted successfully.",
            true);
    }
}

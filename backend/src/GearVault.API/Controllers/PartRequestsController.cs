using System.Net;
using Gridforce.Attributes;
using Microsoft.AspNetCore.Mvc;
using GearVault.API.Attributes;
using GearVault.Application.DTOs.PartRequests;
using GearVault.Application.Interfaces.Services;

namespace GearVault.API.Controllers;

[Authorize]
[ApiController]
[Route("api/part-requests")]
public class PartRequestsController(IPartRequestService partRequestService) : ControllerBase
{
    [HttpGet]
    [Documentation("GetMyPartRequests", "Retrieve all part requests submitted by the current user.")]
    public ActionResult<List<PartRequestDto>> GetMyPartRequests()
    {
        var result = partRequestService.GetMyPartRequests();
        return Ok(result);
    }

    [HttpGet("{partRequestId:guid}")]
    [Documentation("GetPartRequestById", "Retrieve a part request by identifier.")]
    public ActionResult<PartRequestDto> GetPartRequestById([FromRoute] Guid partRequestId)
    {
        var result = partRequestService.GetPartRequestById(partRequestId);
        return Ok(result);
    }

    [HttpPost]
    [Documentation("CreatePartRequest", "Submit a new part request.")]
    public ActionResult<PartRequestDto> CreatePartRequest([FromBody] CreatePartRequestDto dto)
    {
        var result = partRequestService.CreatePartRequest(dto);
        return StatusCode((int)HttpStatusCode.Created, result);
    }

    [HttpPut("{partRequestId:guid}")]
    [Documentation("UpdatePartRequest", "Update an existing part request.")]
    public ActionResult<PartRequestDto> UpdatePartRequest([FromRoute] Guid partRequestId, [FromBody] UpdatePartRequestDto dto)
    {
        var result = partRequestService.UpdatePartRequest(partRequestId, dto);
        return Ok(result);
    }

    [HttpDelete("{partRequestId:guid}")]
    [Documentation("DeletePartRequest", "Delete a part request.")]
    public ActionResult DeletePartRequest([FromRoute] Guid partRequestId)
    {
        partRequestService.DeletePartRequest(partRequestId);
        return NoContent();
    }
}

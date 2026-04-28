using System.Net;
using Gridforce.Attributes;
using Microsoft.AspNetCore.Mvc;
using GearVault.API.Attributes;
using GearVault.Application.DTOs.Parts;
using GearVault.Application.Common.Response;
using GearVault.Application.Interfaces.Services;

namespace GearVault.API.Controllers;

[Authorize]
[ApiController]
[Route("api/parts")]
public class PartsController(IPartService partService) : ControllerBase
{
    [HttpGet]
    [Documentation("GetAllParts", "Retrieve all parts.")]
    public ActionResult<List<PartDto>> GetAllParts()
    {
        var result = partService.GetAllParts();
        return Ok(result);
    }

    [HttpGet("{partId:guid}")]
    [Documentation("GetPartById", "Retrieve a part by identifier.")]
    public ActionResult<PartDto> GetPartById([FromRoute] Guid partId)
    {
        var result = partService.GetPartById(partId);
        return Ok(result);
    }

    [HttpPost]
    [Documentation("CreatePart", "Create a new part.")]
    public ActionResult<PartDto> CreatePart([FromBody] CreatePartDto dto)
    {
        var result = partService.CreatePart(dto);
        return StatusCode((int)HttpStatusCode.Created, result);
    }

    [HttpPut("{partId:guid}")]
    [Documentation("UpdatePart", "Update an existing part.")]
    public ActionResult<PartDto> UpdatePart([FromRoute] Guid partId, [FromBody] UpdatePartDto dto)
    {
        var result = partService.UpdatePart(partId, dto);
        return Ok(result);
    }

    [HttpDelete("{partId:guid}")]
    [Documentation("DeletePart", "Delete a part.")]
    public ActionResult DeletePart([FromRoute] Guid partId)
    {
        partService.DeletePart(partId);
        return NoContent();
    }
}

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
    public ResponseDto<List<PartDto>> GetAllParts()
    {
        var result = partService.GetAllParts();
        return new ResponseDto<List<PartDto>>(
            (int)HttpStatusCode.OK,
            "Parts retrieved successfully.",
            result);
    }

    [HttpGet("{partId:guid}")]
    [Documentation("GetPartById", "Retrieve a part by identifier.")]
    public ResponseDto<PartDto> GetPartById([FromRoute] Guid partId)
    {
        var result = partService.GetPartById(partId);
        return new ResponseDto<PartDto>(
            (int)HttpStatusCode.OK,
            "Part retrieved successfully.",
            result);
    }

    [HttpPost]
    [Documentation("CreatePart", "Create a new part.")]
    public ResponseDto<PartDto> CreatePart([FromBody] CreatePartDto dto)
    {
        var result = partService.CreatePart(dto);
        return new ResponseDto<PartDto>(
            (int)HttpStatusCode.Created,
            "Part created successfully.",
            result);
    }

    [HttpPut("{partId:guid}")]
    [Documentation("UpdatePart", "Update an existing part.")]
    public ResponseDto<PartDto> UpdatePart([FromRoute] Guid partId, [FromBody] UpdatePartDto dto)
    {
        var result = partService.UpdatePart(partId, dto);
        return new ResponseDto<PartDto>(
            (int)HttpStatusCode.OK,
            "Part updated successfully.",
            result);
    }

    [HttpDelete("{partId:guid}")]
    [Documentation("DeletePart", "Delete a part.")]
    public ResponseDto<bool> DeletePart([FromRoute] Guid partId)
    {
        partService.DeletePart(partId);
        return new ResponseDto<bool>(
            (int)HttpStatusCode.OK,
            "Part deleted successfully.",
            true);
    }
}

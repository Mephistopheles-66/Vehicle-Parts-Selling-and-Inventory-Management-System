using System.Net;
using Gridforce.Attributes;
using Microsoft.AspNetCore.Mvc;
using GearVault.API.Attributes;
using GearVault.Application.DTOs.Vehicles;
using GearVault.Application.Interfaces.Services;

namespace GearVault.API.Controllers;

[Authorize]
[ApiController]
[Route("api/vehicles")]
public class VehiclesController(IVehicleService vehicleService) : ControllerBase
{
    [HttpGet]
    [Documentation("GetMyVehicles", "Retrieve all vehicles belonging to the logged in customer.")]
    public ActionResult<List<VehicleDto>> GetMyVehicles()
    {
        var result = vehicleService.GetMyVehicles();
        return Ok(result);
    }

    [HttpGet("{vehicleId:guid}")]
    [Documentation("GetVehicleById", "Retrieve a vehicle by identifier.")]
    public ActionResult<VehicleDto> GetVehicleById([FromRoute] Guid vehicleId)
    {
        var result = vehicleService.GetVehicleById(vehicleId);
        return Ok(result);
    }

    [HttpPost]
    [Documentation("CreateVehicle", "Register a new vehicle for the logged in customer.")]
    public ActionResult<VehicleDto> CreateVehicle([FromBody] CreateVehicleDto dto)
    {
        var result = vehicleService.CreateVehicle(dto);
        return StatusCode((int)HttpStatusCode.Created, result);
    }

    [HttpPut("{vehicleId:guid}")]
    [Documentation("UpdateVehicle", "Update an existing vehicle.")]
    public ActionResult<VehicleDto> UpdateVehicle([FromRoute] Guid vehicleId, [FromBody] UpdateVehicleDto dto)
    {
        var result = vehicleService.UpdateVehicle(vehicleId, dto);
        return Ok(result);
    }

    [HttpDelete("{vehicleId:guid}")]
    [Documentation("DeleteVehicle", "Delete a vehicle.")]
    public ActionResult DeleteVehicle([FromRoute] Guid vehicleId)
    {
        vehicleService.DeleteVehicle(vehicleId);
        return NoContent();
    }
}

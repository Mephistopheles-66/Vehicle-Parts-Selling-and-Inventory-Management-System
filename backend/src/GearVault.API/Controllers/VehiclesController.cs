using System.Net;
using Gridforce.Attributes;
using Microsoft.AspNetCore.Mvc;
using GearVault.API.Attributes;
using GearVault.Application.Common.Response;
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
    public ResponseDto<List<VehicleDto>> GetMyVehicles()
    {
        var result = vehicleService.GetMyVehicles();
        return new ResponseDto<List<VehicleDto>>(
            (int)HttpStatusCode.OK,
            "Vehicles retrieved successfully.",
            result);
    }

    [HttpGet("{vehicleId:guid}")]
    [Documentation("GetVehicleById", "Retrieve a vehicle by identifier.")]
    public ResponseDto<VehicleDto> GetVehicleById([FromRoute] Guid vehicleId)
    {
        var result = vehicleService.GetVehicleById(vehicleId);
        return new ResponseDto<VehicleDto>(
            (int)HttpStatusCode.OK,
            "Vehicle retrieved successfully.",
            result);
    }

    [HttpPost]
    [Documentation("CreateVehicle", "Register a new vehicle for the logged in customer.")]
    public ResponseDto<VehicleDto> CreateVehicle([FromBody] CreateVehicleDto dto)
    {
        var result = vehicleService.CreateVehicle(dto);
        return new ResponseDto<VehicleDto>(
            (int)HttpStatusCode.Created,
            "Vehicle created successfully.",
            result);
    }

    [HttpPut("{vehicleId:guid}")]
    [Documentation("UpdateVehicle", "Update an existing vehicle.")]
    public ResponseDto<VehicleDto> UpdateVehicle([FromRoute] Guid vehicleId, [FromBody] UpdateVehicleDto dto)
    {
        var result = vehicleService.UpdateVehicle(vehicleId, dto);
        return new ResponseDto<VehicleDto>(
            (int)HttpStatusCode.OK,
            "Vehicle updated successfully.",
            result);
    }

    [HttpDelete("{vehicleId:guid}")]
    [Documentation("DeleteVehicle", "Delete a vehicle.")]
    public ResponseDto<bool> DeleteVehicle([FromRoute] Guid vehicleId)
    {
        vehicleService.DeleteVehicle(vehicleId);
        return new ResponseDto<bool>(
            (int)HttpStatusCode.OK,
            "Vehicle deleted successfully.",
            true);
    }
}

using System.Net;
using GearVault.API.Controllers.Base;
using GearVault.Application.Common.Response;
using GearVault.Application.DTOs.PartFailurePredictions;
using GearVault.Application.Interfaces.Services;
using Gridforce.Attributes;
using Microsoft.AspNetCore.Mvc;

namespace GearVault.API.Controllers;

public class AiVehicleHealthController(IPartFailurePredictionService partFailurePredictionService)
    : BaseController<AiVehicleHealthController>
{
    [HttpPost("vehicles/{vehicleId:guid}/predict")]
    [Documentation("GenerateVehicleHealthPrediction", "AI-style predictive vehicle health analysis for possible part failures.")]
    public ResponseDto<PartFailurePredictionDto> GenerateVehicleHealthPrediction(
        [FromRoute] Guid vehicleId,
        [FromBody] CreatePartFailurePredictionDto dto)
    {
        var result = partFailurePredictionService.GeneratePrediction(vehicleId, dto);

        return new ResponseDto<PartFailurePredictionDto>(
            (int)HttpStatusCode.OK,
            "AI vehicle health prediction generated successfully.",
            result);
    }

    [HttpGet("predictions/my")]
    [Documentation("GetMyVehicleHealthPredictions", "Retrieve AI vehicle health predictions for the logged-in customer.")]
    public ResponseDto<List<PartFailurePredictionDto>> GetMyVehicleHealthPredictions()
    {
        var result = partFailurePredictionService.GetMyPredictions();

        return new ResponseDto<List<PartFailurePredictionDto>>(
            (int)HttpStatusCode.OK,
            "AI vehicle health predictions retrieved successfully.",
            result);
    }

    [HttpGet("vehicles/{vehicleId:guid}/predictions")]
    [Documentation("GetVehicleHealthPredictionsByVehicle", "Retrieve AI vehicle health predictions for a specific vehicle.")]
    public ResponseDto<List<PartFailurePredictionDto>> GetVehicleHealthPredictionsByVehicle([FromRoute] Guid vehicleId)
    {
        var result = partFailurePredictionService.GetPredictionsByVehicle(vehicleId);

        return new ResponseDto<List<PartFailurePredictionDto>>(
            (int)HttpStatusCode.OK,
            "AI vehicle health predictions retrieved successfully.",
            result);
    }

    [HttpPatch("predictions/{predictionId:guid}/acknowledge")]
    [Documentation("AcknowledgeVehicleHealthPrediction", "Mark an AI vehicle health prediction as acknowledged.")]
    public ResponseDto<bool> AcknowledgeVehicleHealthPrediction([FromRoute] Guid predictionId)
    {
        partFailurePredictionService.AcknowledgePrediction(predictionId);

        return new ResponseDto<bool>(
            (int)HttpStatusCode.OK,
            "AI vehicle health prediction acknowledged successfully.",
            true);
    }
}

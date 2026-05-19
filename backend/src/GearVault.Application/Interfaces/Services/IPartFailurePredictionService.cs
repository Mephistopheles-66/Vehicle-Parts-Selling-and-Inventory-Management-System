using GearVault.Application.Common.Service;
using GearVault.Application.DTOs.PartFailurePredictions;

namespace GearVault.Application.Interfaces.Services;

public interface IPartFailurePredictionService : ITransientService
{
    PartFailurePredictionDto GeneratePrediction(Guid vehicleId, CreatePartFailurePredictionDto dto);

    List<PartFailurePredictionDto> GetMyPredictions();

    List<PartFailurePredictionDto> GetPredictionsByVehicle(Guid vehicleId);

    void AcknowledgePrediction(Guid predictionId);
}

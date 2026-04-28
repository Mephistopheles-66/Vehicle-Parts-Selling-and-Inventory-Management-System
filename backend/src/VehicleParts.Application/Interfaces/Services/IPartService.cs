using VehicleParts.Application.DTOs.Parts;
using VehicleParts.Application.Common.Service;

namespace VehicleParts.Application.Interfaces.Services;

public interface IPartService : ITransientService
{
    List<PartDto> GetAllParts();

    PartDto GetPartById(Guid partId);

    PartDto CreatePart(CreatePartDto dto);

    PartDto UpdatePart(Guid partId, UpdatePartDto dto);

    void DeletePart(Guid partId);
}

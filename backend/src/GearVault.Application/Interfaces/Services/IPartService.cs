using GearVault.Application.DTOs.Parts;
using GearVault.Application.Common.Service;

namespace GearVault.Application.Interfaces.Services;

public interface IPartService : ITransientService
{
    List<PartDto> GetAllParts();

    PartDto GetPartById(Guid partId);

    PartDto CreatePart(CreatePartDto dto);

    PartDto UpdatePart(Guid partId, UpdatePartDto dto);

    void DeletePart(Guid partId);
}

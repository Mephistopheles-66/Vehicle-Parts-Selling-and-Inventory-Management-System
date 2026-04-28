using GearVault.Application.Common.Service;
using GearVault.Application.DTOs.PartRequests;

namespace GearVault.Application.Interfaces.Services;

public interface IPartRequestService : ITransientService
{
    List<PartRequestDto> GetMyPartRequests();

    PartRequestDto GetPartRequestById(Guid partRequestId);

    PartRequestDto CreatePartRequest(CreatePartRequestDto dto);

    PartRequestDto UpdatePartRequest(Guid partRequestId, UpdatePartRequestDto dto);

    void DeletePartRequest(Guid partRequestId);
}

using GearVault.Application.Common.Service;
using GearVault.Application.DTOs.PartRequests;

namespace GearVault.Application.Interfaces.Services;

public interface IPartRequestService : ITransientService
{
    List<PartRequestDto> GetMyPartRequests();

    List<PartRequestDto> GetAllPartRequests();

    PartRequestDto UpdatePartRequestStatus(Guid partRequestId, string status);

    PartRequestDto GetPartRequestById(Guid partRequestId);

    PartRequestDto CreatePartRequest(CreatePartRequestDto dto);

    PartRequestDto UpdatePartRequest(Guid partRequestId, UpdatePartRequestDto dto);

    void DeletePartRequest(Guid partRequestId);
}

using GearVault.Domain.Entities;
using GearVault.Application.Common.User;
using GearVault.Application.DTOs.PartRequests;
using GearVault.Application.Exceptions;
using GearVault.Application.Interfaces.Services;
using GearVault.Application.Interfaces.Repositories;

namespace GearVault.Infrastructure.Implementation.Services;

public class PartRequestService(
    IGenericRepository genericRepository,
    IApplicationUserService applicationUserService) : IPartRequestService
{
    public List<PartRequestDto> GetMyPartRequests()
    {
        var userId = applicationUserService.GetUserId;

        var partRequests = genericRepository.Get<PartRequest>(
            x => x.CustomerUserId == userId,
            asNoTracking: true).ToList();

        return partRequests.ConvertAll(x => x.ToPartRequestDto());
    }

    public PartRequestDto GetPartRequestById(Guid partRequestId)
    {
        var userId = applicationUserService.GetUserId;

        var partRequest = genericRepository.GetById<PartRequest>(partRequestId, asNoTracking: true)
            ?? throw new NotFoundException("Part request not found.");

        if (partRequest.CustomerUserId != userId)
            throw new NotFoundException("Part request not found.");

        return partRequest.ToPartRequestDto();
    }

    public PartRequestDto CreatePartRequest(CreatePartRequestDto dto)
    {
        var userId = applicationUserService.GetUserId;

        var partRequest = new PartRequest(userId, dto.PartName, dto.Description);
        genericRepository.Insert(partRequest);

        return partRequest.ToPartRequestDto();
    }

    public PartRequestDto UpdatePartRequest(Guid partRequestId, UpdatePartRequestDto dto)
    {
        var userId = applicationUserService.GetUserId;

        var partRequest = genericRepository.GetById<PartRequest>(partRequestId)
            ?? throw new NotFoundException("Part request not found.");

        if (partRequest.CustomerUserId != userId)
            throw new NotFoundException("Part request not found.");

        partRequest.Update(
            dto.PartName ?? partRequest.PartName,
            dto.Description ?? partRequest.Description,
            dto.IsActive ?? partRequest.IsActive);

        genericRepository.Update(partRequest);

        return partRequest.ToPartRequestDto();
    }

    public void DeletePartRequest(Guid partRequestId)
    {
        var userId = applicationUserService.GetUserId;

        var partRequest = genericRepository.GetById<PartRequest>(partRequestId)
            ?? throw new NotFoundException("Part request not found.");

        if (partRequest.CustomerUserId != userId)
            throw new NotFoundException("Part request not found.");

        genericRepository.Delete(partRequest);
    }
}

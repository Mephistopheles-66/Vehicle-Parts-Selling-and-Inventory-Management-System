using GearVault.Domain.Entities;

namespace GearVault.Application.DTOs.PartRequests;

public static class PartRequestExtensionMethod
{
    public static PartRequestDto ToPartRequestDto(this PartRequest partRequest)
    {
        return new PartRequestDto
        {
            Id = partRequest.Id,
            CustomerUserId = partRequest.CustomerUserId,
            CustomerName = partRequest.Customer?.Name ?? string.Empty,
            PartName = partRequest.PartName,
            Description = partRequest.Description,
            Status = partRequest.Status.ToString().ToUpper(),
            IsActive = partRequest.IsActive,
            CreatedAt = partRequest.CreatedAt,
            UpdatedAt = partRequest.UpdatedAt
        };
    }
}

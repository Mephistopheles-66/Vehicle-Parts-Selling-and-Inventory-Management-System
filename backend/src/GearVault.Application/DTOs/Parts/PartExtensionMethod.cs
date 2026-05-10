using GearVault.Domain.Entities;

namespace GearVault.Application.DTOs.Parts;

public static class PartExtensionMethod
{
    public static PartDto ToPartDto(this Part part)
    {
        return new PartDto
        {
            Id = part.Id,
            PartNumber = part.PartNumber,
            Name = part.Name,
            Description = part.Description,
            Category = part.Category,
            Unit = part.Unit.ToString().ToUpper(),
            StockQuantity = part.StockQuantity,
            ReorderLevel = part.ReorderLevel,
            SellingPrice = part.SellingPrice,
            IsActive = part.IsActive,
            CreatedAt = part.CreatedAt,
            UpdatedAt = part.UpdatedAt
        };
    }
}

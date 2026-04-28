using VehicleParts.Domain.Entities;

namespace VehicleParts.Application.DTOs.Parts;

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
            StockQty = part.StockQty,
            ReorderLevel = part.ReorderLevel,
            CostPrice = part.CostPrice,
            SellingPrice = part.SellingPrice,
            IsActive = part.IsActive,
            CreatedAt = part.CreatedAt,
            UpdatedAt = part.UpdatedAt
        };
    }
}

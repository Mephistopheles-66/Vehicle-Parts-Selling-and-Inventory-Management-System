using VehicleParts.Domain.Common.Base;
using VehicleParts.Domain.Common.Enum;

namespace VehicleParts.Domain.Entities;

public class Part(
    string partNumber,
    string name,
    string? description,
    string? category,
    UnitType unit,
    int stockQty,
    int reorderLevel,
    decimal costPrice,
    decimal sellingPrice
) : BaseEntity<Guid>
{
    public string PartNumber { get; private set; } = partNumber;

    public string Name { get; private set; } = name;

    public string? Description { get; private set; } = description;

    public string? Category { get; private set; } = category;

    public UnitType Unit { get; private set; } = unit;

    public int StockQty { get; private set; } = stockQty;

    public int ReorderLevel { get; private set; } = reorderLevel;

    public decimal CostPrice { get; private set; } = costPrice;

    public decimal SellingPrice { get; private set; } = sellingPrice;

    public DateTime UpdatedAt { get; private set; } = DateTime.Now;

    public void Update(
        string partNumber,
        string name,
        string? description,
        string? category,
        UnitType unit,
        int reorderLevel,
        decimal costPrice,
        decimal sellingPrice,
        bool isActive)
    {
        PartNumber = partNumber;
        Name = name;
        Description = description;
        Category = category;
        Unit = unit;
        ReorderLevel = reorderLevel;
        CostPrice = costPrice;
        SellingPrice = sellingPrice;
        IsActive = isActive;
        UpdatedAt = DateTime.Now;
    }

    public void AdjustStock(int quantityChange)
    {
        StockQty += quantityChange;
        UpdatedAt = DateTime.Now;
    }
}

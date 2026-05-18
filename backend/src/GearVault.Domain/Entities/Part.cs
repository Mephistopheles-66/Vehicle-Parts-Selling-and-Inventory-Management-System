using GearVault.Domain.Common.Base;
using GearVault.Domain.Common.Enum;

namespace GearVault.Domain.Entities;

public class Part(
    string partNumber,
    string name,
    string? description,
    string? category,
    UnitType unit,
    int stockQuantity,
    int reorderLevel,
    decimal sellingPrice
) : BaseEntity<Guid>
{
    public string PartNumber { get; private set; } = partNumber;

    public string Name { get; private set; } = name;

    public string? Description { get; private set; } = description;

    public string? Category { get; private set; } = category;

    public UnitType Unit { get; private set; } = unit;

    public int StockQuantity { get; private set; } = stockQuantity;

    public int ReorderLevel { get; private set; } = reorderLevel;

    public decimal SellingPrice { get; private set; } = sellingPrice;

    public DateTime UpdatedAt { get; private set; } = DateTime.Now;

    public virtual ICollection<PartFailurePrediction>? PartFailurePredictions { get; set; }

    public void Update(
        string partNumber,
        string name,
        string? description,
        string? category,
        UnitType unit,
        int stockQuantity,
        int reorderLevel,
        decimal sellingPrice,
        bool isActive)
    {
        PartNumber = partNumber;
        Name = name;
        Description = description;
        Category = category;
        Unit = unit;
        StockQuantity = stockQuantity;
        ReorderLevel = reorderLevel;
        SellingPrice = sellingPrice;
        IsActive = isActive;
        UpdatedAt = DateTime.Now;
    }

    public void AdjustStock(int quantityChange)
    {
        StockQuantity += quantityChange;
        UpdatedAt = DateTime.Now;
    }
}

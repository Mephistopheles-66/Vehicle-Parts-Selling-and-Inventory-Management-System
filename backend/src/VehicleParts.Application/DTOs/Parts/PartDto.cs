namespace VehicleParts.Application.DTOs.Parts;

public class PartDto
{
    public Guid Id { get; set; }
    public string PartNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public string Unit { get; set; } = string.Empty;
    public int StockQty { get; set; }
    public int ReorderLevel { get; set; }
    public decimal CostPrice { get; set; }
    public decimal SellingPrice { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

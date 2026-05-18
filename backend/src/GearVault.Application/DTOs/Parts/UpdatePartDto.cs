namespace GearVault.Application.DTOs.Parts;

public class UpdatePartDto
{
    public string? PartNumber { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Category { get; set; }
    public string? Unit { get; set; }
    public int? StockQuantity { get; set; }
    public int? ReorderLevel { get; set; }
    public decimal? SellingPrice { get; set; }
    public bool? IsActive { get; set; }
}

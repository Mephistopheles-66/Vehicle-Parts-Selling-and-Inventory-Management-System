namespace GearVault.Application.DTOs.Parts;

public class CreatePartDto
{
    public string PartNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public string Unit { get; set; } = "PIECE";
    public int ReorderLevel { get; set; }
    public decimal CostPrice { get; set; }
    public decimal SellingPrice { get; set; }
    public bool IsActive { get; set; } = true;
}

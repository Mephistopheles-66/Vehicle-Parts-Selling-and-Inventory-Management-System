using GearVault.Domain.Common.Enum;

namespace GearVault.Application.DTOs.Assets;

public class AssetDto
{
    public string FileUrl { get; set; } = string.Empty;
    
    public string OriginalFileName { get; set; } = string.Empty;

    public double? AspectRatio { get; set; }

    public Orientation? Orientation { get; set; }
}
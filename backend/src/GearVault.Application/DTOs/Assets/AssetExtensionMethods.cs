using GearVault.Domain.Entities;

namespace GearVault.Application.DTOs.Assets;

public static class AssetExtensionMethods
{
    public static Asset ToAssetModel(this AssetDto asset)
    {
        return new Asset(asset.FileUrl, asset.OriginalFileName, asset.AspectRatio, asset.Orientation);
    }

    public static AssetDto ToAssetDto(this Asset asset)
    {
        return new AssetDto
        {
            FileUrl = $"http://localhost:5165/images/user-images/{asset.FileUrl}",
            OriginalFileName = asset.OriginalFileName,
            AspectRatio = asset.AspectRatio,
            Orientation = asset.Orientation
        };
    }
}
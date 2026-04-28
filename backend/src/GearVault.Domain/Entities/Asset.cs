using System.Text.Json.Serialization;
using GearVault.Domain.Common.Enum;

namespace GearVault.Domain.Entities;

public class Asset(string fileUrl, string originalFileName, double? aspectRatio = null, Orientation? orientation = null)
{
    [JsonPropertyName("FileUrl")]
    public string FileUrl { get; private set; } = fileUrl;

    [JsonPropertyName("OriginalFileName")]
    public string OriginalFileName { get; private set; } = originalFileName;

    [JsonPropertyName("AspectRatio")]
    public double? AspectRatio { get; private set; } = aspectRatio;

    [JsonPropertyName("Orientation")]
    public Orientation? Orientation { get; private set; } = orientation;
}
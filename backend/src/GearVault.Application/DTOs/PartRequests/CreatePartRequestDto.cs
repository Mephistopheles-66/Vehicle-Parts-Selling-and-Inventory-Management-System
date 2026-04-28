namespace GearVault.Application.DTOs.PartRequests;

public class CreatePartRequestDto
{
    public string PartName { get; set; } = string.Empty;
    public string? Description { get; set; }
}

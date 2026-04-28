namespace GearVault.Application.DTOs.PartRequests;

public class UpdatePartRequestDto
{
    public string? PartName { get; set; }
    public string? Description { get; set; }
    public bool? IsActive { get; set; }
}

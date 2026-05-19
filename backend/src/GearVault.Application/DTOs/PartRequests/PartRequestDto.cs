namespace GearVault.Application.DTOs.PartRequests;

public class PartRequestDto
{
    public Guid Id { get; set; }
    public Guid CustomerUserId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string PartName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

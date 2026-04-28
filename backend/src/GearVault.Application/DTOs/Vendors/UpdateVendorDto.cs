namespace GearVault.Application.DTOs.Vendors;

public class UpdateVendorDto
{
    public string? Name { get; set; }
    public string? ContactEmail { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public bool? IsActive { get; set; }
}

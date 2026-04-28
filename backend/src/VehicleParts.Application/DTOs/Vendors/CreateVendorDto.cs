namespace VehicleParts.Application.DTOs.Vendors;

public class CreateVendorDto
{
    public string Name { get; set; } = string.Empty;
    public string? ContactEmail { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public bool IsActive { get; set; } = true;
}

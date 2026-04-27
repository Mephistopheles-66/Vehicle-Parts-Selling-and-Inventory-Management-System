namespace VehicleParts.Application.DTOs.Profiles;

public class UpdateProfileDto
{
    public string Name { get; set; } = string.Empty;

    public string EmailAddress { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string? Address { get; set; }
}
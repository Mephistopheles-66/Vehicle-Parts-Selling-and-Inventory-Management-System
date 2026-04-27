using Microsoft.AspNetCore.Http;

namespace VehicleParts.Application.DTOs.Authentication;

public class RegisterDto
{
    public string Name { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;

    public string EmailAddress { get; set; } = string.Empty;

    public string? Address { get; set; }

    public IFormFile? Image { get; set; }

    public string Password { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;
}
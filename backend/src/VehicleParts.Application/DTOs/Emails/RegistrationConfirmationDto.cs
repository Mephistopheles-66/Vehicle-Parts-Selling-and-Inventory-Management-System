namespace VehicleParts.Application.DTOs.Emails;

public class RegistrationConfirmationDto
{
    public Guid UserId { get; set; }

    public string Password { get; set; } = string.Empty;
}
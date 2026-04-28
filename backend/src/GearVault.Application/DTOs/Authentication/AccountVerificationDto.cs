namespace GearVault.Application.DTOs.Authentication;

public class AccountVerificationDto
{
    public string EmailAddressOrUsername { get; set; } = string.Empty;

    public string VerificationCode { get; set; } = string.Empty;
}
using GearVault.Application.DTOs.Profiles;

namespace GearVault.Application.DTOs.Authentication;

public class LoginSpaDto
{
    public ProfileDto Profile { get; set; } = new();
}
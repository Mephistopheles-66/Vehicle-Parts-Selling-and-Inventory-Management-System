using VehicleParts.Application.DTOs.Profiles;

namespace VehicleParts.Application.DTOs.Authentication;

public class LoginSpaDto
{
    public ProfileDto Profile { get; set; } = new();
}
using Microsoft.AspNetCore.Http;

namespace GearVault.Application.DTOs.Profiles;

public class UpdateProfileImageDto
{
    public required IFormFile ProfileImage { get; set; }
}

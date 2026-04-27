using Microsoft.AspNetCore.Http;

namespace VehicleParts.Application.DTOs.Profiles;

public class UpdateProfileImageDto
{
    public required IFormFile ProfileImage { get; set; }
}

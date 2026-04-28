using Microsoft.AspNetCore.Http;

namespace GearVault.Application.DTOs.Users;

public class UpdateUserDto : AbstractUserRegistrationDto
{
    public Guid Id { get; set; }
    
    public IFormFile? ProfileImage { get; set; }
}
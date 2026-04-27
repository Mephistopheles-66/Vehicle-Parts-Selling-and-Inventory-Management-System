using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using VehicleParts.Application.Exceptions;
using VehicleParts.Application.Common.User;

namespace VehicleParts.Infrastructure.Implementation.Services;

public class ApplicationUserService(IHttpContextAccessor contextAccessor) : IApplicationUserService
{
    public bool IsAuthenticated
    {
        get
        {
            var userId = contextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            return userId != null;
        }
    }
    
    public Guid GetUserId
    {
        get
        {
            var userIdClaimValue = contextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            return Guid.TryParse(userIdClaimValue, out var userId) ? userId : Guid.Empty;
        }
    }

    public string GetUserEmail
    {
        get
        {
            var emailAddressClaimValue = contextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Email);

            return emailAddressClaimValue ?? throw new NotFoundException("The respective user is not authenticated.");
        }
    }

    public string GetUserRole
    {
        get
        {
            var roleClaimValue = contextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Role);

            return roleClaimValue ?? throw new NotFoundException("The respective user is not authenticated.");
        }
    }

    public bool IsInRole(string role)
    {
        var roleName = contextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Role);

        return roleName != null && roleName == role;
    }

    public IEnumerable<Claim> GetUserClaims()
    {
        var claims = contextAccessor.HttpContext?.User.Claims;
        
        return claims ?? [];
    }
}
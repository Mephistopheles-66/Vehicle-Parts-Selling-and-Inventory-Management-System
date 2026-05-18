using System.Text;
using System.Text.Json;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using GearVault.Domain.Common;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using GearVault.Domain.Entities;
using Microsoft.IdentityModel.Tokens;
using GearVault.Domain.Common.Enum;
using System.IdentityModel.Tokens.Jwt;
using GearVault.Application.Settings;
using GearVault.Application.Exceptions;
using GearVault.Application.DTOs.Emails;
using GearVault.Application.DTOs.Assets;
using GearVault.Application.DTOs.Profiles;
using GearVault.Application.Common.Helper;
using GearVault.Application.DTOs.Authentication;
using GearVault.Application.Interfaces.Managers;
using GearVault.Application.Interfaces.Services;
using GearVault.Application.Interfaces.Repositories;
using SameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode;

namespace GearVault.Infrastructure.Implementation.Services;

public class AuthenticationService(
    IFileService fileService,
    ITokenManager tokenManager,
    IOptions<JwtSettings> jwtSettings,
    IGenericRepository genericRepository,
    IWebHostEnvironment webHostEnvironment,
    IHttpContextAccessor httpContextAccessor) : IAuthenticationService
{
    private readonly JwtSettings _jwtSettings = jwtSettings.Value;
    private const string UserImagesFilePath = Constants.FilePath.UserImagesFilePath;

    #region Login
    public TokenDto Login(LoginDto login)
    {
        RemoveCookies();

        var user = genericRepository.GetFirstOrDefault<User>(x => x.EmailAddress.ToLower() == login.EmailAddressOrUsername.ToLower() || x.Username.ToLower() == login.EmailAddressOrUsername.ToLower())
            ?? throw new NotFoundException("The following user has not been registered to our system. Please check your email or username.");

        if (!user.IsActive)
            throw new BadRequestException("You can not log in to the system as the respective user is not active, please contact the administrator.");

        var isPasswordValid = login.Password.VerifyHash(user.PasswordHash);

        if (!isPasswordValid)
            throw new NotFoundException("Invalid password, please try again.");

        return GenerateAccessToken(user);
    }

    public LoginSpaDto LoginViaSpa(LoginDto login)
    {
        RemoveCookies();

        var user = genericRepository.GetFirstOrDefault<User>(x => x.EmailAddress.ToLower() == login.EmailAddressOrUsername.ToLower() || x.Username.ToLower() == login.EmailAddressOrUsername.ToLower())
                   ?? throw new NotFoundException("The following user has not been registered to our system. Please check your email or username.");

        if (!user.IsActive)
            throw new BadRequestException("You can not log in to the system as the respective user is not active, please contact the administrator.");

        var isPasswordValid = login.Password.VerifyHash(user.PasswordHash);

        if (!isPasswordValid)
            throw new NotFoundException("Invalid password, please try again.");

        var accessToken = GenerateAccessToken(user);

        SetTokenCookie(accessToken.Token);

        return new LoginSpaDto()
        {
            Profile = accessToken.Profile
        };
    }
    #endregion

    #region Logout
    public void Logout()
    {
        var context = httpContextAccessor.HttpContext;

        var accessToken = context?.Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "", StringComparison.OrdinalIgnoreCase).Trim();

        if (!string.IsNullOrEmpty(accessToken))
        {
            tokenManager.BlacklistToken(accessToken);
        }

        RemoveCookies();
    }
    #endregion

    #region Register
    public void Register(RegisterDto registration)
    {
        var duplicateUser = genericRepository.GetFirstOrDefault<User>(x => x.EmailAddress.ToLower() == registration.EmailAddress.ToLower() || x.Username.ToLower() == registration.Username.ToLower());

        if (duplicateUser != null)
            throw new BadRequestException("A user with the same email address or username already exists, please try with a different email address or username.");

        var customerRole = genericRepository.GetById<Role>(Constants.Roles.Customer.Id)
            ?? throw new NotFoundException("Customer role could not be found, please contact the administrator.");

        var profileImage = registration.Image != null ? fileService.UploadDocument(registration.Image, UserImagesFilePath) : null;

        var password = registration.Password.Hash();

        var user = new User(
            customerRole.Id,
            registration.Name,
            registration.Username.ToLower(),
            registration.EmailAddress.ToLower(),
            registration.Address,
            profileImage?.ToAssetModel(),
            password,
            registration.PhoneNumber,
            false,
            null);

        genericRepository.Insert(user);

        var accountConfirmation = new AccountConfirmationDto()
        {
            EmailAddressOrUsername = user.EmailAddress
        };

        ConfirmAccount(accountConfirmation);
    }

    public void ConfirmAccount(AccountConfirmationDto accountConfirmation)
    {
        var user = genericRepository.GetFirstOrDefault<User>(x => x.EmailAddress.ToLower() == accountConfirmation.EmailAddressOrUsername.ToLower() || x.Username.ToLower() == accountConfirmation.EmailAddressOrUsername.ToLower())
                   ?? throw new NotFoundException("The following user has not been registered to our system. Please check your email or username.");

        if (!user.IsActive)
            throw new BadRequestException("You can not log in to the system as the respective user is not active, please contact the administrator.");

        var verificationCode = PasswordExtensionMethods.GeneratePassword(6, false, false, true, false);

        user.UpdateVerificationCode(verificationCode);

        var emailModel = new EmailAddressVerificationDto()
        {
            UserId = user.Id
        };

        var outbox = new EmailOutbox(
            user.EmailAddress,
            user.Name,
            "Account Confirmation",
            EmailProcess.CustomerRegistration,
            JsonSerializer.Serialize(emailModel)
        );

        genericRepository.Insert(outbox);

        genericRepository.Update(user);
    }

    public void VerifyAccount(Application.DTOs.Authentication.AccountVerificationDto accountVerification)
    {
        var user = genericRepository.GetFirstOrDefault<User>(x => x.EmailAddress.ToLower() == accountVerification.EmailAddressOrUsername.ToLower() || x.Username.ToLower() == accountVerification.EmailAddressOrUsername.ToLower())
                   ?? throw new NotFoundException("The following user has not been registered to our system. Please check your email or username.");

        if (!user.IsActive)
            throw new BadRequestException("You can not log in to the system as the respective user is not active, please contact the administrator.");

        if (user.VerificationCode != accountVerification.VerificationCode) 
            throw new BadRequestException("The verification code does not match, please input a valid verification code or send a new confirmation email.");

        user.Verify();

        genericRepository.Update(user);
    }
    #endregion

    #region Private Methods
    #region Token Handlers
    private TokenDto GenerateAccessToken(User user)
    {
        var key = Encoding.ASCII.GetBytes(_jwtSettings.Key);
        var issuer = _jwtSettings.Issuer;
        var audience = _jwtSettings.Audience;
        var accessTokenExpirationInMinutes = Convert.ToInt32(_jwtSettings.AccessTokenExpirationInMinutes);

        var role = genericRepository.GetById<Role>(user.RoleId)
                   ?? throw new NotFoundException("The following role could not be found.");

        var authClaims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Name),
            new(ClaimTypes.Email, user.EmailAddress),
            new(ClaimTypes.Role, role.Name),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var dateTime = DateTime.Now;
        var expirationTime = dateTime.AddMinutes(accessTokenExpirationInMinutes);

        var symmetricSigningKey = new SymmetricSecurityKey(key);
        var signingCredentials = new SigningCredentials(symmetricSigningKey, SecurityAlgorithms.HmacSha256);

        var accessToken = new JwtSecurityToken(
            issuer,
            audience,
            authClaims,
            dateTime.AddMinutes(-1),
            expirationTime,
            signingCredentials
        );

        var jsonWebToken = new JwtSecurityTokenHandler().WriteToken(accessToken);

        return new TokenDto
        {
            Token = jsonWebToken,
            Profile = user.ToProfileDto(role)
        };
    }
    #endregion

    #region Cookie Handlers
    private void SetTokenCookie(string token)
    {
        var expires = DateTime.Now.AddMinutes(_jwtSettings.AccessTokenExpirationInMinutes);
        var expirationPeriod = expires.ToUnixTimeMilliSeconds().ToString();

        var jsonWebToken = token.Split('.');
        var webTokenSignature = jsonWebToken[2];
        var webTokenHeaderAndPayload = jsonWebToken[0] + "." + jsonWebToken[1];

        RemoveCookies();
        
        httpContextAccessor.HttpContext?.Response.Cookies.Append(Constants.Cookie.TokenPayload, webTokenHeaderAndPayload, SetCookieOptions(expires, true));
        
        httpContextAccessor.HttpContext?.Response.Cookies.Append(Constants.Cookie.TokenSignature, webTokenSignature, SetCookieOptions(expires, false, true));

        httpContextAccessor.HttpContext?.Response.Cookies.Append(Constants.Cookie.TokenExpiration, expirationPeriod, SetCookieOptions(expires, true));
    }

    private void RemoveCookies()
    {
        var cookies = new[]
        {
            Constants.Cookie.TokenPayload,
            Constants.Cookie.TokenSignature,
            Constants.Cookie.TokenExpiration,
        };
        
        foreach (var cookie in cookies)
        {
            httpContextAccessor.HttpContext?.Response.Cookies.Delete(cookie);
        }
    }

    private CookieOptions SetCookieOptions(DateTime expirationPeriod, bool isExpirationPeriodRequired, bool httpOnly = false)
    {
        var isProduction = webHostEnvironment.IsProduction();

        return new CookieOptions
        {
            HttpOnly = httpOnly,
            Expires = isExpirationPeriodRequired ? expirationPeriod : null,
            Secure = isProduction,
            SameSite = isProduction ? SameSiteMode.Strict : SameSiteMode.Lax,
        };
    }
    #endregion
    #endregion
}
using System.Net;
using Gridforce.Attributes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VehicleParts.API.Controllers.Base;
using VehicleParts.Application.Common.Response;
using VehicleParts.Application.DTOs.Authentication;
using VehicleParts.Application.Interfaces.Services;

namespace VehicleParts.API.Controllers;

[AllowAnonymous]
public class AuthenticationController(IAuthenticationService authenticationService) : BaseController<AuthenticationController>
{
    #region Login
    [HttpPost("login")]
    [Documentation("Login", "Login user and return access token details.")]
    public ResponseDto<TokenDto> Login([FromBody] LoginDto login)
    {
        var result = authenticationService.Login(login);

        return new ResponseDto<TokenDto>(
            (int)HttpStatusCode.OK,
            "Successfully logged in.",
            result);
    }

    [HttpPost("login/spa")]
    [Documentation("LoginViaSpa", "Login user via SPA and return SPA login details.")]
    public ResponseDto<LoginSpaDto> LoginViaSpa([FromBody] LoginDto login)
    {
        var result = authenticationService.LoginViaSpa(login);

        return new ResponseDto<LoginSpaDto>(
            (int)HttpStatusCode.OK,
            "Successfully logged in.",
            result);
    }
    #endregion

    #region Register
    [HttpPost("register")]
    [Documentation("Register", "Register a new customer account.")]
    public ResponseDto<bool> Register([FromForm] RegisterDto registration)
    {
        authenticationService.Register(registration);

        return new ResponseDto<bool>(
            (int)HttpStatusCode.OK,
            "Registration completed successfully. Please verify your account.",
            true);
    }

    [HttpPost("confirm/account")]
    [Documentation("ConfirmAccount", "Confirm registered account using confirmation details.")]
    public ResponseDto<bool> ConfirmAccount([FromBody] AccountConfirmationDto accountConfirmation)
    {
        authenticationService.ConfirmAccount(accountConfirmation);

        return new ResponseDto<bool>(
            (int)HttpStatusCode.OK,
            "Account confirmed successfully.",
            true);
    }

    [HttpPost("verify/account")]
    [Documentation("VerifyAccount", "Verify registered account using verification code.")]
    public ResponseDto<bool> VerifyAccount([FromBody] AccountVerificationDto accountVerification)
    {
        authenticationService.VerifyAccount(accountVerification);

        return new ResponseDto<bool>(
            (int)HttpStatusCode.OK,
            "Account verified successfully.",
            true);
    }
    #endregion

    #region Logout
    [HttpPost("logout")]
    [Documentation("Logout", "Logout the currently logged in user.")]
    public ResponseDto<bool> Logout()
    {
        authenticationService.Logout();

        return new ResponseDto<bool>(
            (int)HttpStatusCode.OK,
            "Logged out successfully.",
            true);
    }
    #endregion
}
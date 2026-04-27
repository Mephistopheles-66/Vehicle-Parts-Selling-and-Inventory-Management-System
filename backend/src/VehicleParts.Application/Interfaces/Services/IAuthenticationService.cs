using VehicleParts.Application.Common.Service;
using VehicleParts.Application.DTOs.Authentication;

namespace VehicleParts.Application.Interfaces.Services;

public interface IAuthenticationService : ITransientService
{
    #region Login
    TokenDto Login(LoginDto login);

    LoginSpaDto LoginViaSpa(LoginDto login);
    #endregion

    #region Register
    void Register(RegisterDto registration);

    void ConfirmAccount(AccountConfirmationDto accountConfirmation);

    void VerifyAccount(AccountVerificationDto accountVerification);
    #endregion

    #region Logout
    void Logout();
    #endregion
}
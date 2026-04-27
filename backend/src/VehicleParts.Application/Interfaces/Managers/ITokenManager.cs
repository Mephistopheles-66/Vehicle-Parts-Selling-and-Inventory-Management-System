using VehicleParts.Application.Common.Service;

namespace VehicleParts.Application.Interfaces.Managers;

public interface ITokenManager : ISingletonService
{
    void BlacklistToken(string token);

    bool IsBlacklisted(string token);
}
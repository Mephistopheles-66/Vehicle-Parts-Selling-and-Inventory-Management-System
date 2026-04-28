using GearVault.Application.Common.Service;

namespace GearVault.Application.Interfaces.Managers;

public interface ITokenManager : ISingletonService
{
    void BlacklistToken(string token);

    bool IsBlacklisted(string token);
}
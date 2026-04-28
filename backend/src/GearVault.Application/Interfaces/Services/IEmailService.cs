using GearVault.Application.DTOs.Emails;
using GearVault.Application.Common.Service;

namespace GearVault.Application.Interfaces.Services;

public interface IEmailService : ITransientService
{
    Task SendEmailAsync(EmailDto email);
}

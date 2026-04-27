using VehicleParts.Application.DTOs.Emails;
using VehicleParts.Application.Common.Service;

namespace VehicleParts.Application.Interfaces.Services;

public interface IEmailService : ITransientService
{
    Task SendEmailAsync(EmailDto email);
}

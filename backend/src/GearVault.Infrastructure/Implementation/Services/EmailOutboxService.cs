using System.Text.Json;
using System.Globalization;
using GearVault.Domain.Common;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using GearVault.Domain.Entities;
using GearVault.Domain.Common.Enum;
using GearVault.Application.Exceptions;
using GearVault.Application.DTOs.Emails;
using GearVault.Application.Common.Helper;
using Microsoft.Extensions.DependencyInjection;
using GearVault.Application.Interfaces.Services;
using GearVault.Application.Interfaces.Repositories;

namespace GearVault.Infrastructure.Implementation.Services;

public class EmailOutboxService(
    IServiceProvider serviceProvider,
    ILogger<EmailOutboxService> logger) : BackgroundService, IEmailOutboxService
{
    #region Background Service Implementation
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await ProcessPendingEmailsAsync();
            await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
        }
    }
    #endregion

    public List<EmailOutboxDto> GetAllEmailOutboxes(
        int pageNumber,
        int pageSize,
        out int rowCount,
        string? globalSearch = null,
        bool[]? isActive = null,
        string[]? orderBys = null,
        string? toEmail = null,
        string? name = null,
        string? subject = null,
        List<EmailProcess>? emailProcess = null,
        int? minimumAttemptCount = null,
        int? maximumAttemptCount = null,
        DateTime? minimumNextAttemptDate = null,
        DateTime? maximumNextAttemptDate = null,
        List<OutboxStatus>? outboxStatuses = null,
        DateTime? minimumScheduledDate = null,
        DateTime? maximumScheduledDate = null,
        DateTime? minimumSentDate = null,
        DateTime? maximumSentDate = null)
    {
        using var scope = serviceProvider.CreateScope();
        var genericRepository = scope.ServiceProvider.GetRequiredService<IGenericRepository>();

        var emailProcessIdentifiers = emailProcess != null ? new HashSet<EmailProcess>(emailProcess) : null;
        var outboxStatusesIdentifiers = outboxStatuses != null ? new HashSet<OutboxStatus>(outboxStatuses) : null;

        var normalizedName = name?.Trim().ToLower();
        var normalizedToEmail = toEmail?.Trim().ToLower();
        var normalizedSubject = subject?.Trim().ToLower();
        var normalizedGlobalSearch = globalSearch?.Trim().ToLower();

        var emailOutboxModels = genericRepository.GetPagedResult<EmailOutbox>(
            pageNumber, pageSize, out rowCount,
            x => 
                (string.IsNullOrEmpty(normalizedGlobalSearch)
                    || x.Name.ToLower().Contains(normalizedGlobalSearch)
                    || x.ToEmail.ToLower().Contains(normalizedGlobalSearch)
                    || x.Subject.ToLower().Contains(normalizedGlobalSearch)
                    || x.Process.ToString().ToLower().Contains(normalizedGlobalSearch)
                    // TODO: Use of CultureInfo.InvariantCulture for all numeric comparisons and searched.
                    || x.AttemptCount.ToString(CultureInfo.InvariantCulture).ToLower().Contains(normalizedGlobalSearch)
                    || x.NextAttemptDate.ToString("dd-MM-yyyy").ToLower().Contains(normalizedGlobalSearch)
                    || x.Status.ToString().ToLower().Contains(normalizedGlobalSearch)
                    || x.ScheduledDate.ToString("dd-MM-yyyy").ToLower().Contains(normalizedGlobalSearch)
                    || (x.SentDate != null && x.SentDate.Value.ToString("dd-MM-yyyy").ToLower().Contains(normalizedGlobalSearch)))
                 && (isActive == null || isActive.Contains(x.IsActive))
                 && (string.IsNullOrEmpty(normalizedToEmail) || x.ToEmail.ToLower().Contains(normalizedToEmail))
                 && (string.IsNullOrEmpty(normalizedName) || x.Name.ToLower().Contains(normalizedName))
                 && (string.IsNullOrEmpty(normalizedSubject) || x.Subject.ToLower().Contains(normalizedSubject))
                 && (emailProcessIdentifiers == null || emailProcessIdentifiers.Contains(x.Process))
                 && (minimumAttemptCount == null || x.AttemptCount >= minimumAttemptCount)
                 && (maximumAttemptCount == null || x.AttemptCount <= maximumAttemptCount)
                 && (minimumNextAttemptDate == null || x.NextAttemptDate >= minimumNextAttemptDate)
                 && (maximumNextAttemptDate == null || x.NextAttemptDate <= maximumNextAttemptDate)
                 && (outboxStatusesIdentifiers == null || outboxStatusesIdentifiers.Contains(x.Status))
                 && (minimumScheduledDate == null || x.ScheduledDate >= minimumScheduledDate)
                 && (maximumScheduledDate == null || x.ScheduledDate <= maximumScheduledDate)
                 && (minimumSentDate == null || (x.SentDate != null && x.SentDate >= minimumSentDate))
                 && (maximumSentDate == null || (x.SentDate != null && x.SentDate <= maximumSentDate)),
            orderBys).ToList();
        
        return emailOutboxModels.Count == 0 ? [] : emailOutboxModels.ConvertAll(x => x.ToEmailOutboxDto());
    }

    public List<EmailOutboxDto> GetAllEmailOutboxes(
        string? globalSearch = null,
        bool[]? isActive = null,
        string[]? orderBys = null,
        string? toEmail = null,
        string? name = null,
        string? subject = null,
        List<EmailProcess>? emailProcess = null,
        int? minimumAttemptCount = null,
        int? maximumAttemptCount = null,
        DateTime? minimumNextAttemptDate = null,
        DateTime? maximumNextAttemptDate = null,
        List<OutboxStatus>? outboxStatuses = null,
        DateTime? minimumScheduledDate = null,
        DateTime? maximumScheduledDate = null,
        DateTime? minimumSentDate = null,
        DateTime? maximumSentDate = null)
    {
        using var scope = serviceProvider.CreateScope();
        var genericRepository = scope.ServiceProvider.GetRequiredService<IGenericRepository>();

        var emailProcessIdentifiers = emailProcess != null ? new HashSet<EmailProcess>(emailProcess) : null;
        var outboxStatusesIdentifiers = outboxStatuses != null ? new HashSet<OutboxStatus>(outboxStatuses) : null;

        var normalizedName = name?.Trim().ToLower();
        var normalizedToEmail = toEmail?.Trim().ToLower();
        var normalizedSubject = subject?.Trim().ToLower();
        var normalizedGlobalSearch = globalSearch?.Trim().ToLower();

        var emailOutboxModels = genericRepository.Get<EmailOutbox>(
            x => 
                (string.IsNullOrEmpty(normalizedGlobalSearch)
                    || x.Name.ToLower().Contains(normalizedGlobalSearch)
                    || x.ToEmail.ToLower().Contains(normalizedGlobalSearch)
                    || x.Subject.ToLower().Contains(normalizedGlobalSearch)
                    || x.Process.ToString().ToLower().Contains(normalizedGlobalSearch)
                    || x.AttemptCount.ToString(CultureInfo.InvariantCulture).ToLower().Contains(normalizedGlobalSearch)
                    || x.NextAttemptDate.ToString("dd-MM-yyyy").ToLower().Contains(normalizedGlobalSearch)
                    || x.Status.ToString().ToLower().Contains(normalizedGlobalSearch)
                    || x.ScheduledDate.ToString("dd-MM-yyyy").ToLower().Contains(normalizedGlobalSearch)
                    || (x.SentDate != null && x.SentDate.Value.ToString("dd-MM-yyyy").ToLower().Contains(normalizedGlobalSearch)))
                 && (isActive == null || isActive.Contains(x.IsActive))
                 && (string.IsNullOrEmpty(normalizedToEmail) || x.ToEmail.ToLower().Contains(normalizedToEmail))
                 && (string.IsNullOrEmpty(normalizedName) || x.Name.ToLower().Contains(normalizedName))
                 && (string.IsNullOrEmpty(normalizedSubject) || x.Subject.ToLower().Contains(normalizedSubject))
                 && (emailProcessIdentifiers == null || emailProcessIdentifiers.Contains(x.Process))
                 && (minimumAttemptCount == null || x.AttemptCount >= minimumAttemptCount)
                 && (maximumAttemptCount == null || x.AttemptCount <= maximumAttemptCount)
                 && (minimumNextAttemptDate == null || x.NextAttemptDate >= minimumNextAttemptDate)
                 && (maximumNextAttemptDate == null || x.NextAttemptDate <= maximumNextAttemptDate)
                 && (outboxStatusesIdentifiers == null || outboxStatusesIdentifiers.Contains(x.Status))
                 && (minimumScheduledDate == null || x.ScheduledDate >= minimumScheduledDate)
                 && (maximumScheduledDate == null || x.ScheduledDate <= maximumScheduledDate)
                 && (minimumSentDate == null || (x.SentDate != null && x.SentDate >= minimumSentDate))
                 && (maximumSentDate == null || (x.SentDate != null && x.SentDate <= maximumSentDate)),
            orderBys).ToList();

        return emailOutboxModels.Count == 0 ? [] : emailOutboxModels.ConvertAll(x => x.ToEmailOutboxDto());
    }

    public EmailOutboxDto GetEmailOutboxById(Guid emailOutboxId)
    {
        using var scope = serviceProvider.CreateScope();
        var genericRepository = scope.ServiceProvider.GetRequiredService<IGenericRepository>();

        var emailOutboxModel = genericRepository.GetById<EmailOutbox>(emailOutboxId)
            ?? throw new NotFoundException($"Email outbox with the identifier of '{emailOutboxId}' could not be found.");

        return emailOutboxModel.ToEmailOutboxDto();
    }

    public async Task ProcessEmailOutboxAsync(Guid emailOutboxId)
    {
        using var scope = serviceProvider.CreateScope();
        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
        var genericRepository = scope.ServiceProvider.GetRequiredService<IGenericRepository>();

        var emailOutboxModel = genericRepository.GetById<EmailOutbox>(emailOutboxId)
                               ?? throw new NotFoundException($"Email outbox with the identifier of '{emailOutboxId}' could not be found.");

        if (emailOutboxModel.Status == OutboxStatus.Sent)
            throw new BadRequestException("The email outbox is already sent.");

        await ProcessSingleEmailOutboxAsync(emailOutboxModel, genericRepository, emailService);
    }

    #region Private Methods
    /// <summary>
    /// The following method will process all pending emails and will not be exposed as an REST API Endpoint.
    /// </summary>
    private async Task ProcessPendingEmailsAsync()
    {
        using var scope = serviceProvider.CreateScope();
        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
        var genericRepository = scope.ServiceProvider.GetRequiredService<IGenericRepository>();

        var emailOutboxes = genericRepository.GetPagedResult<EmailOutbox>(
            1, 20, out _,
            x => x.Status == OutboxStatus.Pending,
            [nameof(EmailOutbox.ScheduledDate)]).ToList();

        foreach (var emailOutbox in emailOutboxes)
        {
            await ProcessSingleEmailOutboxAsync(emailOutbox, genericRepository, emailService);
        }
    }

    private async Task ProcessSingleEmailOutboxAsync(EmailOutbox emailOutbox, IGenericRepository genericRepository, IEmailService emailService)
    {
        try
        {
            emailOutbox.MarkAsSending();
            genericRepository.Update(emailOutbox);

            var emailModel = new EmailDto
            {
                Process = emailOutbox.Process,
                FullName = emailOutbox.Name,
                ToEmailAddress = emailOutbox.ToEmail,
                Subject = emailOutbox.Subject
            };

            switch (emailOutbox.Process)
            {
                case EmailProcess.CustomerRegistration:
                {
                    var verificationEmailModel =
                        JsonSerializer.Deserialize<EmailAddressVerificationDto>(emailOutbox.PayloadJson);

                    if (verificationEmailModel != null)
                    {
                        var userModel = genericRepository.GetById<User>(verificationEmailModel.UserId)
                            ?? throw new NotFoundException($"User with the identifier of {verificationEmailModel.UserId} was not found.");

                        emailModel.Name = userModel.Name;
                        emailModel.Username = userModel.Username;
                        emailModel.EmailAddress = userModel.EmailAddress;
                        emailModel.VerificationCode = userModel.VerificationCode;
                    }

                    break;
                }
                case EmailProcess.UserRegistration:
                {
                    var registrationEmailModel =
                        JsonSerializer.Deserialize<RegistrationConfirmationDto>(emailOutbox.PayloadJson);

                    if (registrationEmailModel != null)
                    {
                        var userModel = genericRepository.GetById<User>(registrationEmailModel.UserId)
                                        ?? throw new NotFoundException($"User with the identifier of {registrationEmailModel.UserId} was not found.");

                        emailModel.Name = userModel.Name;
                        emailModel.Username = userModel.Username;
                        emailModel.EmailAddress = userModel.EmailAddress;
                        emailModel.Password = registrationEmailModel.Password.Decrypt(Constants.Password.SecretKey);
                    }

                    break;
                }
                case EmailProcess.AppointmentConfirmation:
                {
                    var appointmentPayload =
                        JsonSerializer.Deserialize<AppointmentConfirmationPayloadDto>(emailOutbox.PayloadJson);

                    if (appointmentPayload != null)
                    {
                        var appointment = genericRepository.GetById<Appointment>(
                            appointmentPayload.AppointmentId,
                            includeProperties: "Vehicle")
                            ?? throw new NotFoundException($"Appointment with the identifier of {appointmentPayload.AppointmentId} was not found.");

                        emailModel.VehiclePlateNumber = appointment.Vehicle?.PlateNumber ?? string.Empty;
                        emailModel.VehicleMake = appointment.Vehicle?.Make ?? string.Empty;
                        emailModel.VehicleModel = appointment.Vehicle?.Model ?? string.Empty;
                        emailModel.AppointmentDate = appointment.ScheduledAt;
                    }

                    break;
                }
                default:
                    throw new NotSupportedException($"Email process '{emailOutbox.Process}' is not supported in the outbox handler.");
            }

            await emailService.SendEmailAsync(emailModel);

            emailOutbox.MarkAsSent();
            genericRepository.Update(emailOutbox);
        }
        catch (Exception exception)
        {
            emailOutbox.MarkAsFailed(exception.Message);
            genericRepository.Update(emailOutbox);

            logger.LogError($"An exception occured while sending email to {emailOutbox.ToEmail} due to the following reason(s): {exception.Message}.");
        }
    }
    #endregion
}
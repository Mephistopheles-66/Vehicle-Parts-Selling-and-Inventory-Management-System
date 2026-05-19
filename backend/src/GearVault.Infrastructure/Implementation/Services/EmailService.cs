using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using GearVault.Domain.Common;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using GearVault.Domain.Common.Enum;
using GearVault.Application.Settings;
using GearVault.Application.Exceptions;
using GearVault.Application.DTOs.Emails;
using GearVault.Application.Interfaces.Services;

namespace GearVault.Infrastructure.Implementation.Services;

public class EmailService(IWebHostEnvironment webHostEnvironment, IOptions<SmtpSettings> smtpSettings) : IEmailService
{
    private readonly SmtpSettings _smtpSettings = smtpSettings.Value;

    private const string EmailTemplatesFilePath = Constants.FilePath.EmailTemplatesFilePath;

    public async Task SendEmailAsync(EmailDto email)
    {
        try
        {
            using var emailMessage = new MimeMessage();

            #region Senders and Receivers
            var emailFrom = new MailboxAddress("Vehicle", _smtpSettings.Username);
            var emailTo = new MailboxAddress(email.FullName, email.ToEmailAddress);

            emailMessage.From.Add(emailFrom);
            emailMessage.To.Add(emailTo);

            if (!string.IsNullOrEmpty(email.Cc))
            {
                var emailCc = new MailboxAddress(email.Cc, email.Cc);
                emailMessage.Cc.Add(emailCc);
            }
            #endregion

            #region Mail Content and Details
            emailMessage.Subject = email.Subject;

            email.PlaceHolders = GetPlaceHolders(email);
            email.Body = PrepareTemplate(email);

            var emailBodyBuilder = new BodyBuilder()
            {
                HtmlBody = email.Body
            };
            #endregion

            #region Mail Attachments
            if (!string.IsNullOrWhiteSpace(email.FileUrl))
            {
                if (!File.Exists(email.FileUrl))
                    throw new BadRequestException("Attachment file not found on server.");

                var entity = await emailBodyBuilder.Attachments.AddAsync(email.FileUrl);

                if (!string.IsNullOrWhiteSpace(email.FileName))
                    entity.ContentDisposition?.FileName = email.FileName;
            }
            #endregion

            #region Email Finalization
            emailMessage.Body = emailBodyBuilder.ToMessageBody();
            #endregion

            #region Fire and Trigger Mail
            using var mailClient = new SmtpClient();

            mailClient.CheckCertificateRevocation = false;

            await mailClient.ConnectAsync(_smtpSettings.Host, _smtpSettings.Port, SecureSocketOptions.StartTls);
            await mailClient.AuthenticateAsync(_smtpSettings.Username, _smtpSettings.Password);
            await mailClient.SendAsync(emailMessage);
            await mailClient.DisconnectAsync(true);
            #endregion
        }
        catch (Exception exception)
        {
            throw new BadRequestException($"An email could not be triggered to the respective email address, due to the following reason(s): {exception.Message}.");
        }
    }
    
    private static List<KeyValuePair<string, string>> GetPlaceHolders(EmailDto email)
    {
        var result = new List<KeyValuePair<string, string>>
        {
            new("{{Name}}", email.Name ?? "User"),
            new("{{Username}}", email.Username ?? string.Empty),
            new("{{EmailAddress}}", email.EmailAddress ?? string.Empty),
            new("{{CurrentYear}}", DateTime.UtcNow.Year.ToString())
        };

        switch (email.Process)
        {
            case EmailProcess.CustomerRegistration:
                result.Add(new("{{VerificationCode}}", email.VerificationCode ?? string.Empty));
                break;

            case EmailProcess.UserRegistration:
                result.Add(new("{{Password}}", email.Password ?? string.Empty));
                break;

            case EmailProcess.AppointmentConfirmation:
                result.Add(new("{{VehicleNumber}}", email.VehicleNumber ?? string.Empty));
                result.Add(new("{{VehicleMake}}", email.VehicleMake ?? string.Empty));
                result.Add(new("{{VehicleModel}}", email.VehicleModel ?? string.Empty));
                result.Add(new("{{AppointmentDate}}", email.AppointmentDate?.ToString("dd MMM yyyy HH:mm") ?? string.Empty));
                break;

            case EmailProcess.SalesInvoiceCreated:
            case EmailProcess.CreditReminder:
                result.Add(new("{{InvoiceNumber}}", email.InvoiceNumber ?? string.Empty));
                result.Add(new("{{InvoiceDate}}", email.InvoiceDate?.ToString("dd MMM yyyy") ?? string.Empty));
                result.Add(new("{{SubTotal}}", (email.SubTotal ?? 0).ToString("N2")));
                result.Add(new("{{DiscountAmount}}", (email.DiscountAmount ?? 0).ToString("N2")));
                result.Add(new("{{TotalAmount}}", (email.TotalAmount ?? 0).ToString("N2")));
                result.Add(new("{{BalanceDue}}", (email.BalanceDue ?? 0).ToString("N2")));
                break;
        }

        return result;
    }

    private static string UpdatePlaceHolders(string text, IEnumerable<KeyValuePair<string, string>> keyValuePairs)
    {
        if (string.IsNullOrEmpty(text)) return text;

        foreach (var placeholder in keyValuePairs.Where(placeholder => text.Contains(placeholder.Key)))
        {
            text = text.Replace(placeholder.Key, placeholder.Value);
        }

        return text;
    }

    private string PrepareTemplate(EmailDto email)
    {
        return UpdatePlaceHolders(GetEmailBody(email.Process.ToString()), email.PlaceHolders);
    }

    private string GetEmailBody(string templateName)
    {           
        return File.ReadAllText(Path.Combine(webHostEnvironment.WebRootPath, EmailTemplatesFilePath, $"{templateName}.html"));
    }
}

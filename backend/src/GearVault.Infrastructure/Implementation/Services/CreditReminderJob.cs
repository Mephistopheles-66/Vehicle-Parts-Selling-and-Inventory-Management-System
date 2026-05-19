using System.Text.Json;
using GearVault.Domain.Entities;
using GearVault.Domain.Common.Enum;
using GearVault.Application.DTOs.Emails;
using GearVault.Application.Interfaces.Services;
using GearVault.Application.Interfaces.Repositories;

namespace GearVault.Infrastructure.Implementation.Services;

public class CreditReminderJob(IGenericRepository genericRepository) : ICreditReminderJob
{
    #region Overdue Credit Reminder Job
    /// <summary>
    /// Queues reminder emails and admin notifications for unpaid sales invoices older than one month.
    /// </summary>
    public void QueueOverdueCreditReminders()
    {
        var oneMonthAgo = DateTime.Now.AddMonths(-1);
        var reminderCooldownDate = DateTime.Now.AddDays(-7);

        var invoices = genericRepository.Get<SalesInvoice>(
            invoice =>
                invoice.PaymentStatus != PaymentStatus.Paid &&
                invoice.BalanceDue > 0 &&
                invoice.CreatedAt <= oneMonthAgo &&
                (invoice.LastCreditReminderSentAt == null || invoice.LastCreditReminderSentAt <= reminderCooldownDate),
            includeProperties: "Vehicle").ToList();

        if (invoices.Count == 0) return;

        var userIds = invoices
            .Where(invoice => invoice.Vehicle != null)
            .Select(invoice => invoice.Vehicle!.UserId)
            .Distinct()
            .ToHashSet();

        var users = genericRepository.Get<User>(user => userIds.Contains(user.Id))
            .ToDictionary(user => user.Id, user => user);

        foreach (var invoice in invoices)
        {
            if (invoice.Vehicle == null || !users.TryGetValue(invoice.Vehicle.UserId, out var user))
                continue;

            if (string.IsNullOrWhiteSpace(user.EmailAddress))
                continue;

            var payload = new SalesInvoiceEmailPayloadDto
            {
                InvoiceId = invoice.Id,
                InvoiceNumber = invoice.InvoiceNumber,
                UserName = user.Name,
                SubTotal = invoice.SubTotal,
                DiscountAmount = invoice.DiscountAmount,
                TotalAmount = invoice.TotalAmount,
                BalanceDue = invoice.BalanceDue,
                CreatedAt = invoice.CreatedAt
            };

            var outbox = new EmailOutbox(
                toEmail: user.EmailAddress,
                name: user.Name,
                subject: $"Payment reminder for invoice {invoice.InvoiceNumber}",
                process: EmailProcess.CreditReminder,
                payloadJson: JsonSerializer.Serialize(payload));

            genericRepository.Insert(outbox);

            var notification = new AdminNotification(
                AdminNotificationType.OverdueCredit,
                "Overdue credit reminder queued",
                $"Payment reminder queued for {user.Name} on invoice {invoice.InvoiceNumber}. Balance due: {invoice.BalanceDue:N2}.",
                userId: user.Id,
                salesInvoiceId: invoice.Id);

            genericRepository.Insert(notification);

            invoice.MarkCreditReminderSent();
            genericRepository.Update(invoice);
        }
    }
    #endregion
}

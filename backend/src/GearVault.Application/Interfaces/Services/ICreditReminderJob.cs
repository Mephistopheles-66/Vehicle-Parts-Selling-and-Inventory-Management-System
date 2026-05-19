using GearVault.Application.Common.Service;

namespace GearVault.Application.Interfaces.Services;

public interface ICreditReminderJob : ITransientService
{
    void QueueOverdueCreditReminders();
}


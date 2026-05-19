using GearVault.Application.Common.Service;
using GearVault.Application.DTOs.AdminNotifications;

namespace GearVault.Application.Interfaces.Services;

public interface IAdminNotificationService : ITransientService
{
    List<AdminNotificationDto> GetLowStockNotifications();
}

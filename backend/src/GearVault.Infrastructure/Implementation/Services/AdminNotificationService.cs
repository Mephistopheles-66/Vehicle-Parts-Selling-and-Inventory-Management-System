using GearVault.Application.DTOs.AdminNotifications;
using GearVault.Application.Interfaces.Repositories;
using GearVault.Application.Interfaces.Services;
using GearVault.Domain.Common.Enum;
using GearVault.Domain.Entities;

namespace GearVault.Infrastructure.Implementation.Services;

public class AdminNotificationService(IGenericRepository genericRepository) : IAdminNotificationService
{
    public List<AdminNotificationDto> GetLowStockNotifications()
    {
        var notifications = genericRepository.Get<AdminNotification>(
            x => x.Type == AdminNotificationType.LowStock,
            orderBys: new[] { "CreatedAt desc" },
            asNoTracking: true,
            includeProperties: "Part,User").ToList();

        return notifications.ConvertAll(x => x.ToAdminNotificationDto());
    }
}

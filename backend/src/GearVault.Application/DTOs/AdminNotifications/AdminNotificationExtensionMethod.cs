using GearVault.Application.DTOs.Parts;
using GearVault.Application.DTOs.Users;
using GearVault.Domain.Entities;

namespace GearVault.Application.DTOs.AdminNotifications;

public static class AdminNotificationExtensionMethod
{
    public static AdminNotificationDto ToAdminNotificationDto(this AdminNotification notification)
    {
        return new AdminNotificationDto
        {
            Id = notification.Id,
            Type = notification.Type.ToString(),
            Title = notification.Title,
            Message = notification.Message,
            PartId = notification.PartId,
            UserId = notification.UserId,
            SalesInvoiceId = notification.SalesInvoiceId,
            IsRead = notification.IsRead,
            ReadAt = notification.ReadAt,
            CreatedAt = notification.CreatedAt,
            Part = notification.Part?.ToPartDto(),
            User = notification.User?.ToUserDto()
        };
    }
}

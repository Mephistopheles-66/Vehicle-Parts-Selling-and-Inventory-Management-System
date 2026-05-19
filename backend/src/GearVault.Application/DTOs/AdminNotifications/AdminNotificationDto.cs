using GearVault.Application.DTOs.Parts;
using GearVault.Application.DTOs.SalesInvoices;
using GearVault.Application.DTOs.Users;

namespace GearVault.Application.DTOs.AdminNotifications;

public class AdminNotificationDto
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public Guid? PartId { get; set; }
    public Guid? UserId { get; set; }
    public Guid? SalesInvoiceId { get; set; }
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public PartDto? Part { get; set; }
    public UserDto? User { get; set; }
    public SalesInvoiceDto? SalesInvoice { get; set; }
}

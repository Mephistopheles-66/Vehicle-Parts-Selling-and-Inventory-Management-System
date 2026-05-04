using GearVault.Domain.Common.Base;
using GearVault.Domain.Common.Enum;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearVault.Domain.Entities;

public class AdminNotification(
    AdminNotificationType type,
    string title,
    string message,
    Guid? partId = null,
    Guid? userId = null,
    Guid? salesInvoiceId = null,
    Guid? partFailurePredictionId = null
) : BaseEntity<Guid>
{
    public AdminNotificationType Type { get; private set; } = type;

    public string Title { get; private set; } = title;

    public string Message { get; private set; } = message;

    [ForeignKey(nameof(Part))]
    public Guid? PartId { get; private set; } = partId;

    [ForeignKey(nameof(User))]
    public Guid? UserId { get; private set; } = userId;

    [ForeignKey(nameof(SalesInvoice))]
    public Guid? SalesInvoiceId { get; private set; } = salesInvoiceId;

    [ForeignKey(nameof(PartFailurePrediction))]
    public Guid? PartFailurePredictionId { get; private set; } = partFailurePredictionId;

    public bool IsRead { get; private set; }

    public DateTime? ReadAt { get; private set; }

    public virtual Part? Part { get; set; }

    public virtual User? User { get; set; }

    public virtual SalesInvoice? SalesInvoice { get; set; }

    public virtual PartFailurePrediction? PartFailurePrediction { get; set; }

    public void MarkAsRead()
    {
        IsRead = true;
        ReadAt = DateTime.Now;
    }
}

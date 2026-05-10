using GearVault.Domain.Common.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearVault.Domain.Entities;

public class ServiceReview(
    Guid? serviceAppointmentId,
    int rating,
    string? comment
) : AuditableEntity<Guid>
{
    [ForeignKey(nameof(ServiceAppointment))]
    public Guid? ServiceAppointmentId { get; private set; } = serviceAppointmentId;

    public int Rating { get; private set; } = rating;

    public string? Comment { get; private set; } = comment;

    public DateTime ReviewedAt { get; private set; } = DateTime.Now;

    public bool IsApproved { get; private set; }

    public virtual ServiceAppointment? ServiceAppointment { get; set; }

    public void Update(int rating, string? comment)
    {
        Rating = rating;
        Comment = comment;
        ReviewedAt = DateTime.Now;
    }

    public void Approve()
    {
        IsApproved = true;
    }
}

using GearVault.Domain.Common.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearVault.Domain.Entities;

public class Review(
    Guid appointmentId,
    Guid customerUserId,
    int rating,
    string? comment
) : BaseEntity<Guid>
{
    [ForeignKey(nameof(Appointment))]
    public Guid AppointmentId { get; private set; } = appointmentId;

    [ForeignKey(nameof(Customer))]
    public Guid CustomerUserId { get; private set; } = customerUserId;

    public int Rating { get; private set; } = rating;

    public string? Comment { get; private set; } = comment;

    public DateTime UpdatedAt { get; private set; } = DateTime.Now;

    public virtual Appointment? Appointment { get; set; }

    public virtual User? Customer { get; set; }

    public void Update(int rating, string? comment)
    {
        Rating = rating;
        Comment = comment;
        UpdatedAt = DateTime.Now;
    }
}

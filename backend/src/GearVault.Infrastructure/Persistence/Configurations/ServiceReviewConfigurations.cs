using GearVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GearVault.Infrastructure.Persistence.Configurations;

public sealed class ServiceReviewConfigurations : IEntityTypeConfiguration<ServiceReview>
{
    public void Configure(EntityTypeBuilder<ServiceReview> builder)
    {
        builder.ConfigureAuditRelationships();

        builder
            .Property(x => x.Rating)
            .IsRequired();

        builder
            .Property(x => x.Comment)
            .HasMaxLength(1000)
            .IsRequired(false);

        builder
            .Property(x => x.IsApproved)
            .HasDefaultValue(false)
            .IsRequired();

        builder
            .ToTable(t => t.HasCheckConstraint("CK_ServiceReviews_Rating", "\"Rating\" >= 1 AND \"Rating\" <= 5"));

        builder
            .HasOne(x => x.ServiceAppointment)
            .WithMany(a => a.Reviews)
            .HasForeignKey(x => x.ServiceAppointmentId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasIndex(x => x.ServiceAppointmentId);

        builder
            .HasIndex(x => x.Rating);
    }
}

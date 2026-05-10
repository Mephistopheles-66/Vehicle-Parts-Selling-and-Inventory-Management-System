using GearVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GearVault.Infrastructure.Persistence.Configurations;

public sealed class AdminNotificationConfigurations : IEntityTypeConfiguration<AdminNotification>
{
    public void Configure(EntityTypeBuilder<AdminNotification> builder)
    {
        builder
            .Property(x => x.Type)
            .HasConversion<string>()
            .HasMaxLength(64)
            .IsRequired();

        builder
            .Property(x => x.Title)
            .HasMaxLength(150)
            .IsRequired();

        builder
            .Property(x => x.Message)
            .HasMaxLength(1000)
            .IsRequired();

        builder
            .Property(x => x.IsRead)
            .HasDefaultValue(false)
            .IsRequired();

        builder
            .HasOne(x => x.Part)
            .WithMany()
            .HasForeignKey(x => x.PartId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasOne(x => x.SalesInvoice)
            .WithMany()
            .HasForeignKey(x => x.SalesInvoiceId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasOne(x => x.PartFailurePrediction)
            .WithMany()
            .HasForeignKey(x => x.PartFailurePredictionId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasIndex(x => x.Type);

        builder
            .HasIndex(x => x.IsRead);

        builder
            .HasIndex(x => x.CreatedAt);
    }
}

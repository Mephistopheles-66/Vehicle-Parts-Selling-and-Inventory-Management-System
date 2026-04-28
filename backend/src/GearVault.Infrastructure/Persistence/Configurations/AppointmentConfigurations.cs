using GearVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GearVault.Infrastructure.Persistence.Configurations;

public sealed class AppointmentConfigurations : IEntityTypeConfiguration<Appointment>
{
    public void Configure(EntityTypeBuilder<Appointment> builder)
    {
        builder
            .Property(x => x.ScheduledAt)
            .IsRequired();

        builder
            .Property(x => x.Notes)
            .HasMaxLength(1024);

        builder
            .Property(x => x.Status)
            .IsRequired();

        builder
            .HasOne(x => x.Customer)
            .WithMany()
            .HasForeignKey(x => x.CustomerUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(x => x.Review)
            .WithOne(x => x.Appointment)
            .HasForeignKey<Review>(x => x.AppointmentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasIndex(x => x.VehicleId);

        builder
            .HasIndex(x => x.CustomerUserId);
    }
}

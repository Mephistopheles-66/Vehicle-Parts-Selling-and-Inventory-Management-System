using GearVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GearVault.Infrastructure.Persistence.Configurations;

public sealed class ServiceAppointmentConfigurations : IEntityTypeConfiguration<ServiceAppointment>
{
    public void Configure(EntityTypeBuilder<ServiceAppointment> builder)
    {
        builder.ConfigureAuditRelationships();

        builder
            .Property(x => x.ServiceType)
            .HasMaxLength(100)
            .IsRequired();

        builder
            .Property(x => x.IssueDescription)
            .HasMaxLength(1000)
            .IsRequired(false);

        builder
            .Property(x => x.Notes)
            .HasMaxLength(1000)
            .IsRequired(false);

        builder
            .Property(x => x.Status)
            .HasConversion<string>()
            .HasMaxLength(32)
            .IsRequired();

        builder
            .HasOne(x => x.Vehicle)
            .WithMany(v => v.ServiceAppointments)
            .HasForeignKey(x => x.VehicleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.AssignedStaff)
            .WithMany()
            .HasForeignKey(x => x.AssignedStaffId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasIndex(x => x.VehicleId);

        builder
            .HasIndex(x => x.AppointmentDate);

        builder
            .HasIndex(x => x.Status);
    }
}

using GearVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GearVault.Infrastructure.Persistence.Configurations;

public sealed class ServiceRecordConfigurations : IEntityTypeConfiguration<ServiceRecord>
{
    public void Configure(EntityTypeBuilder<ServiceRecord> builder)
    {
        builder.ConfigureAuditRelationships();

        builder
            .Property(x => x.WorkDescription)
            .HasMaxLength(1500)
            .IsRequired();

        builder
            .Property(x => x.TechnicianNotes)
            .HasMaxLength(1500)
            .IsRequired(false);

        builder
            .Property(x => x.TotalCost)
            .HasColumnType("numeric(12,2)")
            .IsRequired();

        builder
            .HasOne(x => x.ServiceAppointment)
            .WithOne(a => a.ServiceRecord)
            .HasForeignKey<ServiceRecord>(x => x.ServiceAppointmentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasIndex(x => x.ServiceDate);

        builder
            .HasIndex(x => x.ServiceAppointmentId)
            .IsUnique();
    }
}

using GearVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GearVault.Infrastructure.Persistence.Configurations;

public sealed class UnavailablePartRequestConfigurations : IEntityTypeConfiguration<UnavailablePartRequest>
{
    public void Configure(EntityTypeBuilder<UnavailablePartRequest> builder)
    {
        builder.ConfigureAuditRelationships();

        builder
            .Property(x => x.RequestedPartName)
            .HasMaxLength(256)
            .IsRequired();

        builder
            .Property(x => x.Description)
            .HasMaxLength(1000)
            .IsRequired(false);

        builder
            .Property(x => x.Status)
            .HasConversion<string>()
            .HasMaxLength(32)
            .IsRequired();

        builder
            .HasOne(x => x.Vehicle)
            .WithMany(v => v.UnavailablePartRequests)
            .HasForeignKey(x => x.VehicleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasIndex(x => x.VehicleId);

        builder
            .HasIndex(x => x.Status);

        builder
            .HasIndex(x => x.RequestedAt);
    }
}

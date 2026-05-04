using GearVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GearVault.Infrastructure.Persistence.Configurations;

public sealed class VehicleConfigurations : IEntityTypeConfiguration<Vehicle>
{
    public void Configure(EntityTypeBuilder<Vehicle> builder)
    {
        builder.ConfigureAuditRelationships();

        builder
            .Property(x => x.VehicleNumber)
            .HasMaxLength(20)
            .IsRequired();

        builder
            .Property(x => x.LicenseNumber)
            .HasMaxLength(30)
            .IsRequired();

        builder
            .Property(x => x.Make)
            .HasMaxLength(50)
            .IsRequired();

        builder
            .Property(x => x.Model)
            .HasMaxLength(50)
            .IsRequired();

        builder
            .Property(x => x.Year)
            .IsRequired();

        builder
            .Property(x => x.FuelType)
            .HasConversion<string>()
            .HasMaxLength(32)
            .IsRequired();

        builder
            .HasOne(x => x.User)
            .WithMany(u => u.Vehicles)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(x => x.SalesInvoices)
            .WithOne(s => s.Vehicle)
            .HasForeignKey(s => s.VehicleId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasIndex(x => x.VehicleNumber)
            .IsUnique();

        builder
            .HasIndex(x => x.LicenseNumber)
            .IsUnique();

        builder
            .HasIndex(x => x.UserId);
    }
}

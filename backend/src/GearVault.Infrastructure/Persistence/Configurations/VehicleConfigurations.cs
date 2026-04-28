using GearVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GearVault.Infrastructure.Persistence.Configurations;

public sealed class VehicleConfigurations : IEntityTypeConfiguration<Vehicle>
{
    public void Configure(EntityTypeBuilder<Vehicle> builder)
    {
        builder
            .Property(x => x.PlateNumber)
            .HasMaxLength(32)
            .IsRequired();

        builder
            .Property(x => x.Make)
            .HasMaxLength(128)
            .IsRequired();

        builder
            .Property(x => x.Model)
            .HasMaxLength(128)
            .IsRequired();

        builder
            .Property(x => x.Year)
            .IsRequired();

        builder
            .Property(x => x.Vin)
            .HasMaxLength(64);

        builder
            .Property(x => x.Mileage)
            .IsRequired();

        builder
            .Property(x => x.FuelType)
            .IsRequired();

        builder
            .HasOne(x => x.Owner)
            .WithMany()
            .HasForeignKey(x => x.OwnerUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasMany(x => x.Appointments)
            .WithOne(x => x.Vehicle)
            .HasForeignKey(x => x.VehicleId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasIndex(x => x.PlateNumber)
            .IsUnique();

        builder
            .HasIndex(x => x.Vin)
            .IsUnique();

        builder
            .HasIndex(x => x.OwnerUserId);
    }
}

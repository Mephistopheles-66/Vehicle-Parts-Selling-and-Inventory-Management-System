using VehicleParts.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace VehicleParts.Infrastructure.Persistence.Configurations;

public sealed class PartConfigurations : IEntityTypeConfiguration<Part>
{
    public void Configure(EntityTypeBuilder<Part> builder)
    {
        builder
            .Property(x => x.PartNumber)
            .HasMaxLength(64)
            .IsRequired();

        builder
            .Property(x => x.Name)
            .HasMaxLength(256)
            .IsRequired();

        builder
            .Property(x => x.Description)
            .HasMaxLength(1024);

        builder
            .Property(x => x.Category)
            .HasMaxLength(128);

        builder
            .Property(x => x.Unit)
            .IsRequired();

        builder
            .Property(x => x.CostPrice)
            .HasPrecision(18, 2);

        builder
            .Property(x => x.SellingPrice)
            .HasPrecision(18, 2);

        builder
            .HasIndex(x => x.PartNumber)
            .IsUnique();
    }
}

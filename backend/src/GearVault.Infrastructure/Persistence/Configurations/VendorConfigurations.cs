using GearVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GearVault.Infrastructure.Persistence.Configurations;

public sealed class VendorConfigurations : IEntityTypeConfiguration<Vendor>
{
    public void Configure(EntityTypeBuilder<Vendor> builder)
    {
        builder
            .Property(x => x.Name)
            .HasMaxLength(256)
            .IsRequired();

        builder
            .Property(x => x.ContactEmail)
            .HasMaxLength(256);

        builder
            .Property(x => x.Phone)
            .HasMaxLength(32);

        builder
            .Property(x => x.Address)
            .HasMaxLength(512);

        builder
            .HasMany(x => x.PurchaseInvoices)
            .WithOne(x => x.Vendor)
            .HasForeignKey(x => x.VendorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasIndex(x => x.Name)
            .IsUnique();
    }
}

using GearVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GearVault.Infrastructure.Persistence.Configurations;

public sealed class CustomerConfigurations : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder
            .Property(x => x.FullName)
            .HasMaxLength(128)
            .IsRequired();

        builder
            .Property(x => x.PhoneNumber)
            .HasMaxLength(20)
            .IsRequired();

        builder
            .Property(x => x.EmailAddress)
            .HasMaxLength(150)
            .IsRequired(false);

        builder
            .Property(x => x.Address)
            .HasMaxLength(250)
            .IsRequired(false);

        builder
            .HasOne(x => x.User)
            .WithOne()
            .HasForeignKey<Customer>(x => x.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasMany(x => x.Vehicles)
            .WithOne(v => v.Customer)
            .HasForeignKey(v => v.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(x => x.SalesInvoices)
            .WithOne(s => s.Customer)
            .HasForeignKey(s => s.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasIndex(x => x.PhoneNumber)
            .IsUnique();

        builder
            .HasIndex(x => x.EmailAddress);

        builder
            .HasIndex(x => x.FullName);
    }
}

using GearVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GearVault.Infrastructure.Persistence.Configurations;

public sealed class SalesInvoiceConfigurations : IEntityTypeConfiguration<SalesInvoice>
{
    public void Configure(EntityTypeBuilder<SalesInvoice> builder)
    {
        builder
            .Property(x => x.InvoiceNumber)
            .HasMaxLength(30)
            .IsRequired();

        builder
            .Property(x => x.SubTotal)
            .HasColumnType("numeric(12,2)")
            .IsRequired();

        builder
            .Property(x => x.DiscountAmount)
            .HasColumnType("numeric(12,2)")
            .HasDefaultValue(0m)
            .IsRequired();

        builder
            .Property(x => x.TotalAmount)
            .HasColumnType("numeric(12,2)")
            .IsRequired();

        builder
            .Property(x => x.PaymentStatus)
            .HasConversion<string>()
            .HasMaxLength(32)
            .IsRequired();

        builder
            .Property(x => x.Remarks)
            .HasMaxLength(500)
            .IsRequired(false);

        builder
            .Property(x => x.EmailSent)
            .HasDefaultValue(false)
            .IsRequired();

        builder
            .HasOne(x => x.Staff)
            .WithMany()
            .HasForeignKey(x => x.StaffId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasMany(x => x.Items)
            .WithOne(i => i.SalesInvoice)
            .HasForeignKey(i => i.SalesInvoiceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasIndex(x => x.InvoiceNumber)
            .IsUnique();

        builder
            .HasIndex(x => x.CustomerId);

        builder
            .HasIndex(x => x.CreatedAt);

        builder
            .HasIndex(x => x.PaymentStatus);
    }
}

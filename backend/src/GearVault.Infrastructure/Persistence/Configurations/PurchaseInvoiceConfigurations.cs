using GearVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GearVault.Infrastructure.Persistence.Configurations;

public sealed class PurchaseInvoiceConfigurations : IEntityTypeConfiguration<PurchaseInvoice>
{
    public void Configure(EntityTypeBuilder<PurchaseInvoice> builder)
    {
        builder
            .Property(x => x.InvoiceNo)
            .HasMaxLength(64)
            .IsRequired();

        builder
            .Property(x => x.Status)
            .IsRequired();

        builder
            .Property(x => x.Subtotal)
            .HasPrecision(18, 2);

        builder
            .Property(x => x.Discount)
            .HasPrecision(18, 2);

        builder
            .Property(x => x.TaxAmount)
            .HasPrecision(18, 2);

        builder
            .Property(x => x.GrandTotal)
            .HasPrecision(18, 2);

        builder
            .Property(x => x.AmountPaid)
            .HasPrecision(18, 2);

        builder
            .Property(x => x.BalanceDue)
            .HasPrecision(18, 2);

        builder
            .HasMany(x => x.LineItems)
            .WithOne(x => x.PurchaseInvoice)
            .HasForeignKey(x => x.PurchaseInvoiceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasIndex(x => x.InvoiceNo)
            .IsUnique();
    }
}

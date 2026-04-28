using GearVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GearVault.Infrastructure.Persistence.Configurations;

public sealed class PurchaseInvoiceLineItemConfigurations : IEntityTypeConfiguration<PurchaseInvoiceLineItem>
{
    public void Configure(EntityTypeBuilder<PurchaseInvoiceLineItem> builder)
    {
        builder
            .Property(x => x.Quantity)
            .IsRequired();

        builder
            .Property(x => x.UnitPrice)
            .HasPrecision(18, 2);

        builder
            .Property(x => x.Total)
            .HasPrecision(18, 2);

        builder
            .HasOne(x => x.Part)
            .WithMany()
            .HasForeignKey(x => x.PartId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

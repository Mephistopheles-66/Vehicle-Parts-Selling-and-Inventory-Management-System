using GearVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GearVault.Infrastructure.Persistence.Configurations;

public sealed class SalesInvoiceItemConfigurations : IEntityTypeConfiguration<SalesInvoiceItem>
{
    public void Configure(EntityTypeBuilder<SalesInvoiceItem> builder)
    {
        builder
            .Property(x => x.PartName)
            .HasMaxLength(150)
            .IsRequired();

        builder
            .Property(x => x.Quantity)
            .IsRequired();

        builder
            .Property(x => x.UnitPrice)
            .HasColumnType("numeric(12,2)")
            .IsRequired();

        builder
            .Property(x => x.LineTotal)
            .HasColumnType("numeric(12,2)")
            .IsRequired();

        builder
            .HasIndex(x => x.SalesInvoiceId);

        builder
            .HasIndex(x => x.PartId);
    }
}

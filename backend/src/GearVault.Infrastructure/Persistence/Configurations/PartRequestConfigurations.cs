using GearVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GearVault.Infrastructure.Persistence.Configurations;

public sealed class PartRequestConfigurations : IEntityTypeConfiguration<PartRequest>
{
    public void Configure(EntityTypeBuilder<PartRequest> builder)
    {
        builder
            .Property(x => x.PartName)
            .HasMaxLength(256)
            .IsRequired();

        builder
            .Property(x => x.Description)
            .HasMaxLength(1024);

        builder
            .Property(x => x.Status)
            .IsRequired();

        builder
            .HasOne(x => x.Customer)
            .WithMany()
            .HasForeignKey(x => x.CustomerUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasIndex(x => x.CustomerUserId);
    }
}

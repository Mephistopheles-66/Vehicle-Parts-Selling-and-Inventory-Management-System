using GearVault.Domain.Common.Base;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GearVault.Infrastructure.Persistence.Configurations;

internal static class AuditableEntityConfigurationExtensions
{
    public static void ConfigureAuditRelationships<TEntity>(this EntityTypeBuilder<TEntity> builder)
        where TEntity : AuditableEntity<Guid>
    {
        builder
            .HasOne(x => x.CreatedUser)
            .WithMany()
            .HasForeignKey(x => x.CreatedBy)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(x => x.LastModifiedUser)
            .WithMany()
            .HasForeignKey(x => x.LastModifiedBy)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasOne(x => x.DeletedUser)
            .WithMany()
            .HasForeignKey(x => x.DeletedBy)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

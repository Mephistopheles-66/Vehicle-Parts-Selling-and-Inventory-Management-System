using GearVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GearVault.Infrastructure.Persistence.Configurations;

public sealed class PartFailurePredictionConfigurations : IEntityTypeConfiguration<PartFailurePrediction>
{
    public void Configure(EntityTypeBuilder<PartFailurePrediction> builder)
    {
        builder.ConfigureAuditRelationships();

        builder
            .Property(x => x.PredictedPartName)
            .HasMaxLength(256)
            .IsRequired();

        builder
            .Property(x => x.ConditionSummary)
            .HasMaxLength(1500)
            .IsRequired();

        builder
            .Property(x => x.UsagePatternSummary)
            .HasMaxLength(1500)
            .IsRequired();

        builder
            .Property(x => x.RiskScore)
            .HasColumnType("numeric(5,2)")
            .IsRequired();

        builder
            .Property(x => x.Severity)
            .HasConversion<string>()
            .HasMaxLength(32)
            .IsRequired();

        builder
            .Property(x => x.Recommendation)
            .HasMaxLength(1500)
            .IsRequired();

        builder
            .Property(x => x.IsAcknowledged)
            .HasDefaultValue(false)
            .IsRequired();

        builder
            .ToTable(t => t.HasCheckConstraint("CK_PartFailurePredictions_RiskScore", "\"RiskScore\" >= 0 AND \"RiskScore\" <= 100"));

        builder
            .HasOne(x => x.Vehicle)
            .WithMany(v => v.PartFailurePredictions)
            .HasForeignKey(x => x.VehicleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.Part)
            .WithMany(p => p.PartFailurePredictions)
            .HasForeignKey(x => x.PartId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasIndex(x => x.VehicleId);

        builder
            .HasIndex(x => x.PartId);

        builder
            .HasIndex(x => x.Severity);

        builder
            .HasIndex(x => x.GeneratedAt);
    }
}

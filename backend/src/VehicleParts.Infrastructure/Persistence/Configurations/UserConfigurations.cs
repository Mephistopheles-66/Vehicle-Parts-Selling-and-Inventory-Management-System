using System.Text.Json;
using VehicleParts.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace VehicleParts.Infrastructure.Persistence.Configurations;

public sealed class UserConfigurations : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder
            .Property(x => x.RoleId)
            .IsRequired();

        builder
            .Property(x => x.Name)
            .HasMaxLength(128)
            .IsRequired();

        builder
            .Property(x => x.Username)
            .HasMaxLength(100)
            .IsRequired();

        builder
            .Property(x => x.EmailAddress)
            .HasMaxLength(150)
            .IsRequired();

        builder
            .Property(x => x.Address)
            .HasMaxLength(250)
            .IsRequired(false);

        builder
            .Property(x => x.ProfileImage)
            .HasConversion(
                v => JsonSerializer.Serialize(v, AssetConfigurations.JsonOptions),
                v => JsonSerializer.Deserialize<Asset>(v, AssetConfigurations.JsonOptions)!)
            .HasColumnType("jsonb")
            .IsRequired(false);
        
        builder
            .Property(x => x.PasswordHash)
            .HasMaxLength(255)
            .IsRequired();

        builder
            .Property(x => x.PhoneNumber)
            .HasMaxLength(20)
            .IsRequired();

        builder
            .Property(x => x.IsVerified)
            .IsRequired();

        builder
            .Property(x => x.VerificationCode)
            .HasMaxLength(6)
            .IsRequired(false);

        builder
            .HasOne(x => x.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(x => x.RoleId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasIndex(x => x.Username)
            .IsUnique();

        builder
            .HasIndex(x => x.EmailAddress)
            .IsUnique();

        builder
            .HasIndex(x => x.PhoneNumber)
            .IsUnique();

        builder
            .HasIndex(x => x.RoleId);
    }
}
using System.Data;
using System.Reflection;
using GearVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using GearVault.Domain.Common.Base;
using GearVault.Application.Settings;
using Microsoft.Extensions.Configuration;
using GearVault.Application.Common.User;
using GearVault.Application.Common.Helper;
using GearVault.Application.Interfaces.Data;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace GearVault.Infrastructure.Persistence;

public class ApplicationDbContext(
    DbContextOptions<ApplicationDbContext> options,
    IApplicationUserService? applicationUserService = null) : DbContext(options), IApplicationDbContext
{
    #region User & Roles Management
    public DbSet<User> Users { get; set; }
    
    public DbSet<Role> Roles { get; set; }
    #endregion

    #region Inventory & Purchasing
    public DbSet<Part> Parts { get; set; }

    public DbSet<Vendor> Vendors { get; set; }

    public DbSet<PurchaseInvoice> PurchaseInvoices { get; set; }

    public DbSet<PurchaseInvoiceLineItem> PurchaseInvoiceLineItems { get; set; }
    #endregion

    #region Vehicle, Service & Sales
    public DbSet<Vehicle> Vehicles { get; set; }

    public DbSet<SalesInvoice> SalesInvoices { get; set; }

    public DbSet<SalesInvoiceItem> SalesInvoiceItems { get; set; }

    public DbSet<ServiceAppointment> ServiceAppointments { get; set; }

    public DbSet<ServiceReview> ServiceReviews { get; set; }

    public DbSet<UnavailablePartRequest> UnavailablePartRequests { get; set; }

    public DbSet<ServiceRecord> ServiceRecords { get; set; }

    public DbSet<PartFailurePrediction> PartFailurePredictions { get; set; }

    public DbSet<Appointment> Appointments { get; set; }

    public DbSet<PartRequest> PartRequests { get; set; }

    public DbSet<Review> Reviews { get; set; }
    #endregion

    #region Modules
    public DbSet<EmailOutbox> EmailOutboxes { get; set; }

    public DbSet<AdminNotification> AdminNotifications { get; set; }
    #endregion

    #region Functions
    public override int SaveChanges()
    {
        UpdateLogs();
    
        return base.SaveChanges();
    }
    
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateLogs();
    
        return await base.SaveChangesAsync(cancellationToken);
    }
    #endregion
    
    #region Properties
    public IDbConnection Connection => Database.GetDbConnection();
    #endregion

    #region Configurations
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var basePath = AppContext.BaseDirectory;

        var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

        if (!Directory.Exists(basePath))
        {
            throw new DirectoryNotFoundException($"The directory '{basePath}' does not exist.");
        }

        var configurationDirectory = Path.Combine(AppContext.BaseDirectory, "Configurations");

        var configuration = new ConfigurationBuilder()
            .AddJsonFile(Path.Combine(configurationDirectory, "database.json"), true, true)
            .AddJsonFile(Path.Combine(configurationDirectory, $"database.{environmentName}.json"), optional: true, reloadOnChange: true)
            .Build();

        var databaseSettings = new DatabaseSettings();

        configuration.GetSection(nameof(DatabaseSettings)).Bind(databaseSettings);

        var connectionString = databaseSettings.ConnectionString;

        optionsBuilder = optionsBuilder.UseDatabase(databaseSettings.DbProvider, connectionString!);

        base.OnConfiguring(optionsBuilder);
    }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        base.OnModelCreating(builder);

        #region Date Time Conversions
        var dateTimePeriod = new ValueConverter<DateTime, DateTime>(
            toProvider   => toProvider.ToUniversalTime(),
            fromProvider => fromProvider.ToLocalTime()
        );

        var dateTimeNullablePeriod = new ValueConverter<DateTime?, DateTime?>(
            toProvider   => toProvider.HasValue ? toProvider.Value.ToUniversalTime() : toProvider,
            fromProvider => fromProvider.HasValue ? fromProvider.Value.ToLocalTime() : fromProvider
        );

        foreach (var entity in builder.Model.GetEntityTypes())
        {
            foreach (var property in entity.GetProperties())
            {
                if (property.ClrType == typeof(DateTime))
                    property.SetValueConverter(dateTimePeriod);

                if (property.ClrType == typeof(DateTime?))
                    property.SetValueConverter(dateTimeNullablePeriod);
            }
        }

        if (!Database.IsNpgsql()) return;
        {
            foreach (var entity in builder.Model.GetEntityTypes())
            {
                foreach (var property in entity.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                        property.SetColumnType("timestamp with time zone");
                }
            }
        }
        #endregion
    }
    #endregion

    #region Logs and Data
    private void UpdateLogs()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.State is EntityState.Added or EntityState.Modified or EntityState.Deleted)
            .ToList();

        if (entries.Count == 0) return;
    
        var userId = applicationUserService?.GetUserId;
    
        foreach (var entry in entries)
        {
            StampEntity(entry.Entity, entry.State, userId ?? Guid.Empty, DateTime.Now);
        }
    }
    #endregion

    #region Change Log Interceptor
    private static void StampEntity(object entity, EntityState state, Guid userId, DateTime dateTime)
    {
        switch (entity)
        {
            case AuditableEntity<Guid> baseEntity when state == EntityState.Added:
                baseEntity.CreatedAt = dateTime;
                if (baseEntity.CreatedBy == Guid.Empty) baseEntity.CreatedBy = userId; break;
    
            case AuditableEntity<Guid> baseEntity when state == EntityState.Modified:
                baseEntity.LastModifiedAt = dateTime;
                baseEntity.LastModifiedBy ??= userId;
                break;
    
            case AuditableEntity<Guid> baseEntity when state == EntityState.Deleted:
                baseEntity.DeletedAt = dateTime; 
                baseEntity.DeletedBy ??= userId; break;
    
            case AuditableEntity<string> baseEntity when state == EntityState.Added:
                baseEntity.CreatedAt = dateTime; 
                if (baseEntity.CreatedBy == Guid.Empty) baseEntity.CreatedBy = userId; break;
    
            case AuditableEntity<string> baseEntity when state == EntityState.Modified:
                baseEntity.LastModifiedAt = dateTime; 
                baseEntity.LastModifiedBy ??= userId; break;
    
            case AuditableEntity<string> baseEntity when state == EntityState.Deleted:
                baseEntity.DeletedAt = dateTime; 
                baseEntity.DeletedBy ??= userId; break;
        }
    }
    #endregion
}

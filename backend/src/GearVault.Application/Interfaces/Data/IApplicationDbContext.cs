using System.Data;
using GearVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using GearVault.Application.Common.Service;

namespace GearVault.Application.Interfaces.Data;

public interface IApplicationDbContext : IScopedService
{
    #region User & Role Management with Permission Module
    DbSet<User> Users { get; set; }

    DbSet<Role> Roles { get; set; }
    #endregion

    #region Inventory & Purchasing
    DbSet<Part> Parts { get; set; }

    DbSet<Vendor> Vendors { get; set; }

    DbSet<PurchaseInvoice> PurchaseInvoices { get; set; }

    DbSet<PurchaseInvoiceLineItem> PurchaseInvoiceLineItems { get; set; }
    #endregion

    #region Modules
    DbSet<EmailOutbox> EmailOutboxes { get; set; }
    #endregion

    #region Functions
    int SaveChanges();
    #endregion

    #region Properties
    IDbConnection Connection { get; }
    #endregion
}

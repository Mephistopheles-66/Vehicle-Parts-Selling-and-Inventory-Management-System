using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using GearVault.Domain.Common.Base;
using GearVault.Infrastructure.Persistence;
using GearVault.Application.Interfaces.Repositories;

namespace GearVault.Infrastructure.Implementation.Repositories;

public sealed class GenericRepository(ApplicationDbContext applicationDbContext) : IGenericRepository
{
    #region Helpers
    private static IQueryable<TEntity> ApplyIncludes<TEntity>(IQueryable<TEntity> query, string? includeProperties)
        where TEntity : BaseEntity<Guid>
    {
        if (string.IsNullOrWhiteSpace(includeProperties)) return query;

        var includes = includeProperties
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        query = includes.Aggregate(query, (current, include) => current.Include(include));

        if (includes.Length > 1) query = query.AsSplitQuery();

        return query;
    }

    private static IQueryable<TEntity> ApplyOrderBys<TEntity>(IQueryable<TEntity> query, string[]? orderBys) where TEntity : BaseEntity<Guid>
    {
        if (orderBys == null || orderBys.Length == 0) return query;

        IOrderedQueryable<TEntity>? ordered = null;

        for (var i = 0; i < orderBys.Length; i++)
        {
            var raw = orderBys[i];

            if (string.IsNullOrWhiteSpace(raw)) continue;

            var parts = raw.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            var prop = parts[0];
            var desc = parts.Length > 1 && parts[1].Equals("desc", StringComparison.OrdinalIgnoreCase);

            if (i == 0)
            {
                ordered = desc
                    ? query.OrderByDescending(e => EF.Property<object>(e, prop))
                    : query.OrderBy(e => EF.Property<object>(e, prop));
            }
            else
            {
                ordered = desc
                    ? ordered!.ThenByDescending(e => EF.Property<object>(e, prop))
                    : ordered!.ThenBy(e => EF.Property<object>(e, prop));
            }
        }

        return ordered ?? query;
    }

    private static IQueryable<TEntity> ApplyTracking<TEntity>(IQueryable<TEntity> query, bool asNoTracking)
        where TEntity : BaseEntity<Guid>
        => asNoTracking ? query.AsNoTracking() : query;
    #endregion

    #region Item Existence
    public bool Exists<TEntity>(Expression<Func<TEntity, bool>>? filter = null)
        where TEntity : BaseEntity<Guid>
    {
        IQueryable<TEntity> query = applicationDbContext.Set<TEntity>();
        if (filter != null) query = query.Where(filter);
        return query.AsNoTracking().Any();
    }
    #endregion

    #region Get Items Collection
    public IQueryable<TEntity> Get<TEntity>(
        Expression<Func<TEntity, bool>>? filter = null,
        string[]? orderBys = null,
        bool asNoTracking = false,
        string? includeProperties = "")
        where TEntity : BaseEntity<Guid>
    {
        IQueryable<TEntity> query = applicationDbContext.Set<TEntity>();

        query = ApplyTracking(query, asNoTracking);
        query = ApplyIncludes(query, includeProperties);

        if (filter != null) query = query.Where(filter);
        query = ApplyOrderBys(query, orderBys);

        return query;
    }

    public IQueryable<TEntity> GetPagedResult<TEntity>(
        int pageNumber,
        int pageSize,
        out int rowCount,
        Expression<Func<TEntity, bool>>? filter = null,
        string[]? orderBys = null,
        bool asNoTracking = false,
        string? includeProperties = "")
        where TEntity : BaseEntity<Guid>
    {
        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1) pageSize = 10;

        IQueryable<TEntity> baseQuery = applicationDbContext.Set<TEntity>();
        baseQuery = ApplyIncludes(baseQuery, includeProperties);

        if (filter != null) baseQuery = baseQuery.Where(filter);

        rowCount = baseQuery.AsNoTracking().Count();

        var pageQuery = ApplyTracking(baseQuery, asNoTracking);
        pageQuery = ApplyOrderBys(pageQuery, orderBys);

        return pageQuery
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize);
    }
    #endregion

    #region Get Item
    public TEntity? GetById<TEntity>(
        object id,
        bool asNoTracking = false,
        string? includeProperties = "")
        where TEntity : BaseEntity<Guid>
    {
        IQueryable<TEntity> query = applicationDbContext.Set<TEntity>();
        query = ApplyTracking(query, asNoTracking);
        query = ApplyIncludes(query, includeProperties);

        var guid = id is Guid g ? g : Guid.Parse(id.ToString()!);

        return query.FirstOrDefault(e => e.Id == guid);
    }

    public TEntity? GetFirstOrDefault<TEntity>(
        Expression<Func<TEntity, bool>> filter,
        bool asNoTracking = false,
        string? includeProperties = "")
        where TEntity : BaseEntity<Guid>
    {
        IQueryable<TEntity> query = applicationDbContext.Set<TEntity>();
        query = ApplyTracking(query, asNoTracking);
        query = ApplyIncludes(query, includeProperties);

        return query.FirstOrDefault(filter);
    }

    public TEntity? GetLastOrDefault<TEntity>(
        Expression<Func<TEntity, bool>> filter,
        bool asNoTracking = false,
        string? includeProperties = "")
        where TEntity : BaseEntity<Guid>
    {
        IQueryable<TEntity> query = applicationDbContext.Set<TEntity>();
        query = ApplyTracking(query, asNoTracking);
        query = ApplyIncludes(query, includeProperties);

        return query.LastOrDefault(filter);
    }
    #endregion

    #region Entry Counts
    public int GetCount<TEntity>(Expression<Func<TEntity, bool>>? filter = null) where TEntity : BaseEntity<Guid>
    {
        IQueryable<TEntity> query = applicationDbContext.Set<TEntity>();
        if (filter != null) query = query.Where(filter);
        return query.AsNoTracking().Count();
    }
    #endregion

    #region Data Insertion
    public Guid Insert<TEntity>(TEntity entity) where TEntity : BaseEntity<Guid>
    {
        applicationDbContext.Set<TEntity>().Add(entity);
        applicationDbContext.SaveChanges();
        return entity.Id;
    }

    public bool AddMultipleEntity<TEntity>(IEnumerable<TEntity> entityList) where TEntity : BaseEntity<Guid>
    {
        var list = entityList as IList<TEntity> ?? entityList.ToList();

        applicationDbContext.Set<TEntity>().AddRange(list);
        return applicationDbContext.SaveChanges() > 0;
    }
    #endregion

    #region Data Updation
    public void Update<TEntity>(TEntity entityToUpdate) where TEntity : BaseEntity<Guid>
    {
        applicationDbContext.Set<TEntity>().Update(entityToUpdate);
        applicationDbContext.SaveChanges();
    }

    public void UpdateMultipleEntity<TEntity>(IEnumerable<TEntity> entityList) where TEntity : BaseEntity<Guid>
    {
        applicationDbContext.Set<TEntity>().UpdateRange(entityList);
        applicationDbContext.SaveChanges();
    }
    #endregion

    #region Data Deletion
    public void Delete<TEntity>(Guid id) where TEntity : BaseEntity<Guid>
    {
        var set = applicationDbContext.Set<TEntity>();
        var entity = set.FirstOrDefault(e => e.Id == id);
        if (entity is null) return;

        set.Remove(entity);
        applicationDbContext.SaveChanges();
    }

    public void Delete<TEntity>(TEntity entityToDelete) where TEntity : BaseEntity<Guid>
    {
        applicationDbContext.Set<TEntity>().Remove(entityToDelete);
        applicationDbContext.SaveChanges();
    }

    public void DeleteMultipleEntity<TEntity>(Expression<Func<TEntity, bool>>? filter) where TEntity : BaseEntity<Guid>
    {
        if (filter is null) return;

        var set = applicationDbContext.Set<TEntity>();
        var toRemove = set.Where(filter).ToList();
        if (toRemove.Count == 0) return;

        set.RemoveRange(toRemove);
        applicationDbContext.SaveChanges();
    }

    public void RemoveMultipleEntity<TEntity>(IEnumerable<TEntity> removeEntityList) where TEntity : BaseEntity<Guid>
    {
        applicationDbContext.Set<TEntity>().RemoveRange(removeEntityList);
        applicationDbContext.SaveChanges();
    }
    #endregion
}
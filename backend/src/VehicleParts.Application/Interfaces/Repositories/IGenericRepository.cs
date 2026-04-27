using System.Linq.Expressions;
using VehicleParts.Domain.Common.Base;
using VehicleParts.Application.Common.Service;

namespace VehicleParts.Application.Interfaces.Repositories;

public interface IGenericRepository : ITransientService
{
    #region Item Existence
    bool Exists<TEntity>(Expression<Func<TEntity, bool>>? filter = null)
        where TEntity : BaseEntity<Guid>;
    #endregion

    #region Get Items Collection
    IQueryable<TEntity> Get<TEntity>(
        Expression<Func<TEntity, bool>>? filter = null,
        string[]? orderBys = null,
        bool asNoTracking = false,
        string? includeProperties = "")
        where TEntity : BaseEntity<Guid>;

    IQueryable<TEntity> GetPagedResult<TEntity>(
        int pageNumber,
        int pageSize,
        out int rowCount,
        Expression<Func<TEntity, bool>>? filter = null,
        string[]? orderBys = null,
        bool asNoTracking = false,
        string? includeProperties = "")
        where TEntity : BaseEntity<Guid>;
    #endregion

    #region Get Item
    TEntity? GetById<TEntity>(
        object id,
        bool asNoTracking = false,
        string? includeProperties = "")
        where TEntity : BaseEntity<Guid>;

    TEntity? GetFirstOrDefault<TEntity>(
        Expression<Func<TEntity, bool>> filter,
        bool asNoTracking = false,
        string? includeProperties = "")
        where TEntity : BaseEntity<Guid>;

    TEntity? GetLastOrDefault<TEntity>(
        Expression<Func<TEntity, bool>> filter,
        bool asNoTracking = false,
        string? includeProperties = "")
        where TEntity : BaseEntity<Guid>;
    #endregion

    #region Entry Counts
    int GetCount<TEntity>(Expression<Func<TEntity, bool>>? filter = null)
        where TEntity : BaseEntity<Guid>;
    #endregion

    #region Data Insertion
    Guid Insert<TEntity>(TEntity entity)
        where TEntity : BaseEntity<Guid>;

    bool AddMultipleEntity<TEntity>(IEnumerable<TEntity> entityList)
        where TEntity : BaseEntity<Guid>;
    #endregion

    #region Data Updation
    void Update<TEntity>(TEntity entityToUpdate)
        where TEntity : BaseEntity<Guid>;

    void UpdateMultipleEntity<TEntity>(IEnumerable<TEntity> entityList)
        where TEntity : BaseEntity<Guid>;
    #endregion

    #region Data Deletion
    void Delete<TEntity>(Guid id)
        where TEntity : BaseEntity<Guid>;

    void Delete<TEntity>(TEntity entityToDelete)
        where TEntity : BaseEntity<Guid>;

    void DeleteMultipleEntity<TEntity>(Expression<Func<TEntity, bool>>? filter)
        where TEntity : BaseEntity<Guid>;

    void RemoveMultipleEntity<TEntity>(IEnumerable<TEntity> removeEntityList)
        where TEntity : BaseEntity<Guid>;
    #endregion
}

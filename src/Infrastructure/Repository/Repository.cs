
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata;
using Medical_Optics.Application.Common.Interfaces;

namespace Medical_Optics.Infrastructure.Repository;

public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
{
    #region Constructor
    protected readonly DbContext _context;
    protected readonly DbSet<TEntity> _dbSet;
    public Repository(DbContext context)
    {
        _context = context;
        _dbSet = context.Set<TEntity>();
    }
    #endregion

    #region Sync

    public virtual TEntity FindBy(params object[] keyValues)
    {
        return _dbSet.Find(keyValues);
    }

    public IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate)
    {
        return _dbSet.Where(predicate);
    }

    public IQueryable<TEntity> Get(Expression<Func<TEntity, bool>> predicate)
    {
        return _dbSet.Where(predicate);
    }
    public IQueryable<TEntity> Get(Expression<Func<TEntity, bool>> predicate, string[] includes = null)
    {
        IQueryable<TEntity> query = _dbSet;
        foreach (var include in includes)
            query = query.Include(include);
        return query;
    }
    public TEntity GetSingleOrDefault(Expression<Func<TEntity, bool>> predicate)
    {
        return _dbSet.SingleOrDefault(predicate);
    }

    public virtual TEntity GetFirstOrDefault(Expression<Func<TEntity, bool>> predicate = null,
                                     Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                     Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
                                     bool disableTracking = true)
    {
        IQueryable<TEntity> query = _dbSet;
        if (disableTracking)
        {
            query = query.AsNoTracking();
        }

        if (include != null)
        {
            query = include(query);
        }

        if (predicate != null)
        {
            query = query.Where(predicate);
        }

        if (orderBy != null)
        {
            return orderBy(query).FirstOrDefault();
        }
        else
        {
            return query.FirstOrDefault();
        }
    }

    public virtual TResult GetFirstOrDefault<TResult>(Expression<Func<TEntity, TResult>> selector,
                                              Expression<Func<TEntity, bool>> predicate = null,
                                              Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                              Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
                                              bool disableTracking = true)
    {
        IQueryable<TEntity> query = _dbSet;
        if (disableTracking)
        {
            query = query.AsNoTracking();
        }

        if (include != null)
        {
            query = include(query);
        }

        if (predicate != null)
        {
            query = query.Where(predicate);
        }

        if (orderBy != null)
        {
            return orderBy(query).Select(selector).FirstOrDefault();
        }
        else
        {
            return query.Select(selector).FirstOrDefault();
        }
    }

    public void Add(TEntity entity)
    {
        _dbSet.Add(entity);
    }

    public void AddRange(IEnumerable<TEntity> entities)
    {
        _dbSet.AddRange(entities);
    }

    public virtual TEntity Update(TEntity entity, object key)
    {
        if (entity == null)
            return null;
        TEntity exist = _context.Set<TEntity>().Find(key);
        if (exist != null)
        {
            _context.Entry(exist).CurrentValues.SetValues(entity);
            _context.SaveChanges();
        }
        return exist;
    }

    public void Remove(TEntity entity)
    {
        _dbSet.Remove(entity);
    }

    public void RemoveRange(IEnumerable<TEntity> entities)
    {
        _dbSet.RemoveRange(entities);
    }

    public bool Any(Expression<Func<TEntity, bool>> predicate, params string[] includes)
    {
        var query = _dbSet.AsQueryable();
        foreach (string include in includes)
            query = query.Include(include);
        return query.Any(predicate);
    }

    public int Count(Expression<Func<TEntity, bool>> predicate)
    {
        var query = _dbSet.AsQueryable();
        return query.Count(predicate);
    }

    public int Count()
    {
        return this._dbSet.Count();
    }

    public virtual IPagedList<TEntity> GetPagedList(Expression<Func<TEntity, bool>> predicate = null,
                                    Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                    Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
                                    int pageIndex = 0,
                                    int pageSize = 20,
                                    bool disableTracking = true)
    {
        IQueryable<TEntity> query = _dbSet;
        if (disableTracking)
        {
            query = query.AsNoTracking();
        }

        if (include != null)
        {
            query = include(query);
        }

        if (predicate != null)
        {
            query = query.Where(predicate);
        }

        if (orderBy != null)
        {
            return orderBy(query).ToPagedList(pageIndex, pageSize);
        }
        else
        {
            return query.ToPagedList(pageIndex, pageSize);
        }
    }

    public virtual IPagedList<TResult> GetPagedList<TResult>(Expression<Func<TEntity, TResult>> selector,
                                                     Expression<Func<TEntity, bool>> predicate = null,
                                                     Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                                     Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
                                                     int pageIndex = 0,
                                                     int pageSize = 20,
                                                     bool disableTracking = true)
        where TResult : class
    {
        IQueryable<TEntity> query = _dbSet;
        if (disableTracking)
        {
            query = query.AsNoTracking();
        }

        if (include != null)
        {
            query = include(query);
        }

        if (predicate != null)
        {
            query = query.Where(predicate);
        }

        if (orderBy != null)
        {
            return orderBy(query).Select(selector).ToPagedList(pageIndex, pageSize);
        }
        else
        {
            return query.Select(selector).ToPagedList(pageIndex, pageSize);
        }
    }




    public virtual IQueryable<TEntity> FromSql(string sql, params object[] parameters)
    {

        return _context.Set<TEntity>().FromSqlRaw(sql, parameters);
    }

    IQueryable<TEntity> IRepository<TEntity>.GetAll()
    {
        return _dbSet.AsQueryable();
    }
    public IQueryable<TEntity> GetWithIncluding(params Expression<Func<TEntity, object>>[] includeProperties)
    {

        IQueryable<TEntity> queryable = _dbSet.AsQueryable();
        foreach (Expression<Func<TEntity, object>> includeProperty in includeProperties)
        {

            queryable = queryable.Include<TEntity, object>(includeProperty);
        }

        return queryable;
    }

    #endregion

    #region Async

    public virtual async Task<TEntity> FindByAsync(params object[] keyValues)
    {
        return await _dbSet.FindAsync(keyValues);
    }

    public virtual async Task<TEntity> FindByAsync(object[] keyValues, CancellationToken cancellationToken)
    {
        return await _dbSet.FindAsync(keyValues, cancellationToken);
    }
    public virtual async Task<TEntity> GetFirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate = null,
       Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
       Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
       bool disableTracking = true)
    {
        IQueryable<TEntity> query = _dbSet;
        if (disableTracking)
        {
            query = query.AsNoTracking();
        }

        if (include != null)
        {
            query = include(query);
        }

        if (predicate != null)
        {
            query = query.Where(predicate);
        }

        if (orderBy != null)
        {
            return await orderBy(query).FirstOrDefaultAsync();
        }
        else
        {
            return await query.FirstOrDefaultAsync();
        }
    }

    public virtual async Task<TResult> GetFirstOrDefaultAsync<TResult>(Expression<Func<TEntity, TResult>> selector,
                                           Expression<Func<TEntity, bool>> predicate = null,
                                           Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                           Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
                                           bool disableTracking = true)
    {
        IQueryable<TEntity> query = _dbSet;
        if (disableTracking)
        {
            query = query.AsNoTracking();
        }

        if (include != null)
        {
            query = include(query);
        }

        if (predicate != null)
        {
            query = query.Where(predicate);
        }

        if (orderBy != null)
        {
            return await orderBy(query).Select(selector).FirstOrDefaultAsync();
        }
        else
        {
            return await query.Select(selector).FirstOrDefaultAsync();
        }
    }


    public Task<IPagedList<TEntity>> GetPagedListAsync(Expression<Func<TEntity, bool>> predicate = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null, Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null, int pageIndex = 0, int pageSize = 20, bool disableTracking = true, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<IPagedList<TResult>> GetPagedListAsync<TResult>(Expression<Func<TEntity, TResult>> selector, Expression<Func<TEntity, bool>> predicate = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null, Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null, int pageIndex = 0, int pageSize = 20, bool disableTracking = true, CancellationToken cancellationToken = default) where TResult : class
    {
        throw new NotImplementedException();
    }


    public Task AddAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task AddRangeAsync(params TEntity[] entities)
    {
        throw new NotImplementedException();
    }

    public Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }
    public virtual async Task<TEntity> UpdateAsyn(TEntity entity, object key)
    {
        if (entity == null)
            return null;
        TEntity exist = await _context.Set<TEntity>().FindAsync(key);
        if (exist != null)
        {
            _context.Entry(exist).CurrentValues.SetValues(entity);
            await _context.SaveChangesAsync();
        }
        return exist;
    }
    public async Task<int> CountAsync()
    {
        return await _context.Set<TEntity>().CountAsync();
    }
    public virtual async Task<int> RemoveAsyn(TEntity entity)
    {
        _context.Set<TEntity>().Remove(entity);
        return await _context.SaveChangesAsync();
    }
    public async virtual Task<int> SaveAsync()
    {
        return await _context.SaveChangesAsync();
    }


    #endregion

    #region Dispose
    private bool disposed = false;
    protected virtual void Dispose(bool disposing)
    {
        if (!this.disposed)
        {
            if (disposing)
            {
                _context.Dispose();
            }
            this.disposed = true;
        }
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }
    #endregion
}
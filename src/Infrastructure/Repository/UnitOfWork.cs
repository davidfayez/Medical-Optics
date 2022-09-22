
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using Medical_Optics.Application.Common.Interfaces;

namespace Medical_Optics.Infrastructure.Repository;

public class UnitOfWork : IUnitOfWork
{
    private readonly DbContext _context;
    private bool disposed = false;
    private Dictionary<Type, object> repositories;
    public UnitOfWork(DbContext context)
    {
        _context = context;

    }

    public IRepository<TEntity> GetRepository<TEntity>(bool hasCustomRepository = false) where TEntity : class
    {
        if (repositories == null)
        {
            repositories = new Dictionary<Type, object>();
        }

        // what's the best way to support custom reposity?
        if (hasCustomRepository)
        {
            var customRepo = _context.GetService<IRepository<TEntity>>();
            if (customRepo != null)
            {
                return customRepo;
            }
        }

        var type = typeof(TEntity);
        if (!repositories.ContainsKey(type))
        {
            repositories[type] = new Repository<TEntity>(_context);
        }

        return (IRepository<TEntity>)repositories[type];
    }
    public IQueryable<TEntity> FromSql<TEntity>(string sql, params object[] parameters) where TEntity : class
    {
        return _context.Set<TEntity>().FromSqlRaw(sql, parameters);
    }

    public int SaveChanges(bool ensureAutoHistory = false)
    {
        var entities = from e in this._context.ChangeTracker.Entries()
                       where e.State == EntityState.Added
                           || e.State == EntityState.Modified
                       select e.Entity;
        foreach (var entity in entities)
        {
            var validationContext = new ValidationContext(entity);
            Validator.ValidateObject(entity, validationContext);
        }
        return _context.SaveChanges();
    }

    public async Task<int> SaveChangesAsync(bool ensureAutoHistory = false)
    {
        //if (ensureAutoHistory)
        //{
        //    _context.EnsureAutoHistory();
        //}

        return await _context.SaveChangesAsync();
    }

    public async Task<int> SaveChangesAsync(bool ensureAutoHistory = false, params IUnitOfWork[] unitOfWorks)
    {
        using var transaction = new TransactionScope();
        var count = 0;
        foreach (var unitOfWork in unitOfWorks)
        {
            count += await unitOfWork.SaveChangesAsync(ensureAutoHistory);
        }

        count += await SaveChangesAsync(ensureAutoHistory);

        transaction.Complete();

        return count;
    }
    public void Dispose()
    {
        Dispose(true);

        GC.SuppressFinalize(this);
    }
    protected virtual void Dispose(bool disposing)
    {
        if (!disposed)
        {
            if (disposing)
            {
                // clear repositories
                if (repositories != null)
                {
                    repositories.Clear();
                }

                // dispose the db context.
                _context.Dispose();
            }
        }
        disposed = true;
    }
}
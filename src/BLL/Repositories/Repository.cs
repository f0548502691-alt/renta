using BLL.Interfaces;
using DAL.Context;
using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace BLL.Repositories;

public class Repository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly AppDbContext Context;
    protected readonly DbSet<T> DbSet;

    public Repository(AppDbContext context)
    {
        Context = context;
        DbSet = context.Set<T>();
    }

    public virtual async Task<T?> GetByIdAsync(int id)
    {
        return await DbSet.FindAsync(id);
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        return await DbSet.ToListAsync();
    }

    public virtual async Task<T> AddAsync(T entity)
    {
        DbSet.Add(entity);
        await Context.SaveChangesAsync();
        return entity;
    }

    public virtual async Task<T?> UpdateAsync(int id, T entity)
    {
        var existing = await DbSet.FindAsync(id);
        if (existing is null)
        {
            return null;
        }

        entity.Id = id;
        Context.Entry(existing).CurrentValues.SetValues(entity);
        await Context.SaveChangesAsync();
        return existing;
    }

    public virtual async Task<bool> DeleteAsync(int id)
    {
        var existing = await DbSet.FindAsync(id);
        if (existing is null)
        {
            return false;
        }

        DbSet.Remove(existing);
        await Context.SaveChangesAsync();
        return true;
    }
}

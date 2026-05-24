using BLL.Repositories;
using BLL.SpecificInterfaces;
using DAL.Context;
using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace BLL.SpecificRepositories;

public class TaskRepository : Repository<TaskItem>, ITaskRepository
{
    public TaskRepository(AppDbContext context) : base(context)
    {
    }

    public override async Task<IEnumerable<TaskItem>> GetAllAsync()
    {
        return await Context.Tasks
            .Include(t => t.User)
            .Include(t => t.Category)
            .ToListAsync();
    }

    public override async Task<TaskItem?> GetByIdAsync(int id)
    {
        return await Context.Tasks
            .Include(t => t.User)
            .Include(t => t.Category)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<IEnumerable<TaskItem>> GetByUserIdAsync(int userId)
    {
        return await Context.Tasks
            .Include(t => t.Category)
            .Where(t => t.UserId == userId)
            .ToListAsync();
    }
}

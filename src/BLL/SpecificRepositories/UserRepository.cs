using BLL.Repositories;
using BLL.SpecificInterfaces;
using DAL.Context;
using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace BLL.SpecificRepositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<User?> GetUserWithTasksAsync(int id)
    {
        return await Context.Users
            .Include(u => u.Tasks)
            .ThenInclude(t => t.Category)
            .FirstOrDefaultAsync(u => u.Id == id);
    }
}

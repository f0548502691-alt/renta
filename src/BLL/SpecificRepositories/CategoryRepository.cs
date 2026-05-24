using BLL.Repositories;
using BLL.SpecificInterfaces;
using DAL.Context;
using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace BLL.SpecificRepositories;

public class CategoryRepository : Repository<Category>, ICategoryRepository
{
    public CategoryRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Category?> GetCategoryWithTasksAsync(int id)
    {
        return await Context.Categories
            .Include(c => c.Tasks)
            .FirstOrDefaultAsync(c => c.Id == id);
    }
}

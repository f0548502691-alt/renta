using BLL.Interfaces;
using DAL.Entities;

namespace BLL.SpecificInterfaces;

public interface ICategoryRepository : IRepository<Category>
{
    Task<Category?> GetCategoryWithTasksAsync(int id);
}

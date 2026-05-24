using BLL.Interfaces;
using DAL.Entities;

namespace BLL.SpecificInterfaces;

public interface ITaskRepository : IRepository<TaskItem>
{
    Task<IEnumerable<TaskItem>> GetByUserIdAsync(int userId);
}

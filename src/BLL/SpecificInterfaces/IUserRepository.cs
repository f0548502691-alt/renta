using BLL.Interfaces;
using DAL.Entities;

namespace BLL.SpecificInterfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetUserWithTasksAsync(int id);
}

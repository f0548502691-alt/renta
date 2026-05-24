using BLL.SpecificInterfaces;
using DAL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace TaskManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;

    public UsersController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<User>> Get(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user is null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> Get()
    {
        var users = await _userRepository.GetAllAsync();
        return Ok(users);
    }

    [HttpPost]
    public async Task<ActionResult<User>> Post([FromBody] User user)
    {
        var created = await _userRepository.AddAsync(user);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<User>> Put(int id, [FromBody] User user)
    {
        var updated = await _userRepository.UpdateAsync(id, user);
        if (updated is null)
        {
            return NotFound();
        }

        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _userRepository.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}

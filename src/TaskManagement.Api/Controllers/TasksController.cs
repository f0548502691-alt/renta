using BLL.SpecificInterfaces;
using DAL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace TaskManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskRepository _taskRepository;

    public TasksController(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TaskItem>> Get(int id)
    {
        var taskItem = await _taskRepository.GetByIdAsync(id);
        if (taskItem is null)
        {
            return NotFound();
        }

        return Ok(taskItem);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskItem>>> Get()
    {
        var tasks = await _taskRepository.GetAllAsync();
        return Ok(tasks);
    }

    [HttpGet("user/{userId:int}")]
    public async Task<ActionResult<IEnumerable<TaskItem>>> GetByUser(int userId)
    {
        var tasks = await _taskRepository.GetByUserIdAsync(userId);
        return Ok(tasks);
    }

    [HttpPost]
    public async Task<ActionResult<TaskItem>> Post([FromBody] TaskItem taskItem)
    {
        var created = await _taskRepository.AddAsync(taskItem);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TaskItem>> Put(int id, [FromBody] TaskItem taskItem)
    {
        var updated = await _taskRepository.UpdateAsync(id, taskItem);
        if (updated is null)
        {
            return NotFound();
        }

        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _taskRepository.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}

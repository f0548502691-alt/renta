using BLL.SpecificInterfaces;
using DAL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace TaskManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoriesController(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Category>> Get(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category is null)
        {
            return NotFound();
        }

        return Ok(category);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> Get()
    {
        var categories = await _categoryRepository.GetAllAsync();
        return Ok(categories);
    }

    [HttpPost]
    public async Task<ActionResult<Category>> Post([FromBody] Category category)
    {
        var created = await _categoryRepository.AddAsync(category);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<Category>> Put(int id, [FromBody] Category category)
    {
        var updated = await _categoryRepository.UpdateAsync(id, category);
        if (updated is null)
        {
            return NotFound();
        }

        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _categoryRepository.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}

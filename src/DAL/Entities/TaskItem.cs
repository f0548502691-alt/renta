using System.ComponentModel.DataAnnotations;

namespace DAL.Entities;

public class TaskItem : BaseEntity
{
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    public DateTime Date { get; set; }

    public TaskStatus Status { get; set; }

    public int UserId { get; set; }
    public User? User { get; set; }

    public int CategoryId { get; set; }
    public Category? Category { get; set; }
}

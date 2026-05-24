using System.ComponentModel.DataAnnotations;

namespace DAL.Entities;

public class Category : BaseEntity
{
    [Required]
    [MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}

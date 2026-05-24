using System.ComponentModel.DataAnnotations;

namespace DAL.Entities;

public class User : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}

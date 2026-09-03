using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class GenericItem
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Category { get; set; } = "management"; // "management", "records", "transactions", "reports"

        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Status { get; set; } = "Active"; // "Active", "Pending", "Completed", "Archived"

        public decimal? Amount { get; set; }

        [MaxLength(100)]
        public string CreatedBy { get; set; } = "Admin";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

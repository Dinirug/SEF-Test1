using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CreateItemDto
    {
        [Required(ErrorMessage = "Category is required.")]
        public string Category { get; set; } = "management"; // "management", "records", "transactions", "reports"

        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Status { get; set; } = "Active";

        public decimal? Amount { get; set; }
    }

    public class UpdateItemDto
    {
        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Status { get; set; } = "Active";

        public decimal? Amount { get; set; }
    }
}

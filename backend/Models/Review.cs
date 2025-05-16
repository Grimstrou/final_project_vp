namespace backend.Models
{
    public class Review
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public string Status { get; set; } = "Revision"; // Revision / Accepted / Rejected
        public int ReviewerId { get; set; }
        public int ArticleId { get; set; }
        public bool IsAccepted { get; set; } = false; // принял ли рецензент статью на рецензию
        public User? Reviewer { get; set; }
        public Article? Article { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
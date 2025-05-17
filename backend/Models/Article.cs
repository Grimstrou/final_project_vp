namespace backend.Models
{
    public class Article
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty; // pdf/docx
        public string Status { get; set; } = "NotReviewed"; // NotReviewed / Revision / Accepted / Rejected
        public int AuthorId { get; set; }
        public User? Author { get; set; }
        public List<int> ReviewerIds { get; set; } = new();
        public List<Review> Reviews { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
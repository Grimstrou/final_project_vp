namespace backend.Models
{
    public class ArticleDto
    {
        public ArticleDto()
        {
            ReviewerIds = new List<int>();
            Reviews = new List<ReviewDto>();
        }

        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int AuthorId { get; set; }
        public UserShortDto? Author { get; set; }
        public List<int> ReviewerIds { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<ReviewDto> Reviews { get; set; }
    }

    public class ReviewDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int ReviewerId { get; set; }
        public int ArticleId { get; set; }
        public bool IsAccepted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public ArticleShortDto? Article { get; set; }
    }

    public class UserShortDto
    {
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }

    public class ArticleShortDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public UserShortDto? Author { get; set; }
    }

    public class AcceptDeclineDto
    {
        public int ArticleId { get; set; }
        public int ReviewerId { get; set; }
    }

    public class SubmitReviewDto
    {
        public int ReviewerId { get; set; }
        public string Text { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
} 
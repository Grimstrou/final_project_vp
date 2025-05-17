using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    public class ArticlesController : BaseController
    {
        private readonly ArticleService _articleService;

        public ArticlesController(ArticleService articleService)
        {
            _articleService = articleService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ArticleDto>>> GetAllArticles([FromQuery] int? authorId)
        {
            List<Article> articles;
            if (authorId.HasValue)
            {
                articles = await _articleService.GetAuthorArticles(authorId.Value);
            }
            else
            {
                articles = await _articleService.GetAllArticles();
            }
            return Ok(articles.Select(ConvertToDto).ToList());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ArticleDto>> GetArticle(int id)
        {
            var article = await _articleService.GetArticleById(id);
            if (article == null)
                return NotFound();
            return Ok(ConvertToDto(article));
        }

        [HttpPost]
        public async Task<ActionResult<Article>> CreateArticle([FromBody] Article article)
        {
            var result = await _articleService.AddArticle(article);
            if (result)
                return CreatedAtAction(nameof(GetArticle), new { id = article.Id }, article);
            return BadRequest("Failed to create article");
        }

        [HttpPut("{id}/status")]
        public async Task<ActionResult> UpdateArticleStatus(int id, [FromBody] string status)
        {
            var result = await _articleService.UpdateArticle(id, article => article.Status = status);
            return HandleResult(result, "Article not found");
        }

        [HttpPut("{id}/reviewers")]
        public async Task<ActionResult> AssignReviewers(int id, [FromBody] List<int> reviewerIds)
        {
            var result = await _articleService.AssignReviewers(id, reviewerIds);
            return HandleResult(result, "Article not found");
        }

        private ArticleDto ConvertToDto(Article a)
        {
            return new ArticleDto
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                FilePath = a.FilePath,
                FileType = a.FileType,
                Status = a.Status,
                AuthorId = a.AuthorId,
                Author = a.Author != null ? new UserShortDto { Id = a.Author.Id, FirstName = a.Author.FirstName, LastName = a.Author.LastName } : null,
                ReviewerIds = a.ReviewerIds,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                Reviews = a.Reviews?.Select(r => new ReviewDto
                {
                    Id = r.Id,
                    Content = r.Content,
                    Status = r.Status,
                    ReviewerId = r.ReviewerId,
                    ArticleId = r.ArticleId,
                    IsAccepted = r.IsAccepted,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                }).ToList() ?? new List<ReviewDto>()
            };
        }

        // DTO classes
        public class ArticleDto
        {
            public int Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string FilePath { get; set; }
            public string FileType { get; set; }
            public string Status { get; set; }
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
            public string Content { get; set; }
            public string Status { get; set; }
            public int ReviewerId { get; set; }
            public int ArticleId { get; set; }
            public bool IsAccepted { get; set; }
            public DateTime CreatedAt { get; set; }
            public DateTime? UpdatedAt { get; set; }
        }
        public class UserShortDto
        {
            public int Id { get; set; }
            public string? FirstName { get; set; }
            public string? LastName { get; set; }
        }
    }
}
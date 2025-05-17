using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    public class ReviewsController : BaseController
    {
        private readonly ReviewService _reviewService;

        public ReviewsController(ReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Review>>> GetAllReviews()
        {
            var reviews = await _reviewService.GetAllReviews();
            return Ok(reviews);
        }

        [HttpGet("reviewer/{reviewerId}")]
        public async Task<ActionResult<List<ReviewDto>>> GetReviewerReviews(int reviewerId)
        {
            var reviews = await _reviewService.GetReviewerReviews(reviewerId);
            var dto = reviews.Select(r => new ReviewDto
            {
                Id = r.Id,
                Content = r.Content,
                Status = r.Status,
                ReviewerId = r.ReviewerId,
                ArticleId = r.ArticleId,
                IsAccepted = r.IsAccepted,
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt,
                Article = r.Article != null ? new ArticleShortDto
                {
                    Id = r.Article.Id,
                    Title = r.Article.Title,
                    Author = r.Article.Author != null ? new UserShortDto
                    {
                        Id = r.Article.Author.Id,
                        FirstName = r.Article.Author.FirstName,
                        LastName = r.Article.Author.LastName
                    } : null
                } : null
            }).ToList();
            return Ok(dto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetReview(int id)
        {
            var review = await _reviewService.GetReviewById(id);
            if (review == null)
                return NotFound();
            return Ok(review);
        }

        [HttpPost]
        public async Task<ActionResult<Review>> CreateReview([FromBody] Review review)
        {
            var result = await _reviewService.AddReview(review);
            if (result)
                return CreatedAtAction(nameof(GetReview), new { id = review.Id }, review);
            return BadRequest("Failed to create review");
        }

        [HttpPut("{id}/status")]
        public async Task<ActionResult> UpdateReviewStatus(int id, [FromBody] string status)
        {
            var result = await _reviewService.UpdateReview(id, review => review.Status = status);
            return HandleResult(result, "Review not found");
        }

        [HttpPut("{id}/handle")]
        public async Task<ActionResult> HandleReview(int id, [FromBody] bool accept)
        {
            var result = await _reviewService.HandleReviewRequest(id, accept);
            return HandleResult(result, "Review not found");
        }

        [HttpGet("new")]
        public async Task<ActionResult<List<Article>>> GetArticlesForReview([FromQuery] int reviewerId)
        {
            var articles = await _reviewService.GetArticlesForReview(reviewerId);
            return Ok(articles);
        }

        [HttpPost("accept")]
        public async Task<ActionResult> AcceptReview([FromBody] AcceptDeclineDto dto)
        {
            var result = await _reviewService.AcceptReview(dto.ArticleId, dto.ReviewerId);
            return result ? Ok() : BadRequest("Failed to accept review");
        }

        [HttpPost("decline")]
        public async Task<ActionResult> DeclineReview([FromBody] AcceptDeclineDto dto)
        {
            var result = await _reviewService.DeclineReview(dto.ArticleId, dto.ReviewerId);
            return result ? Ok() : BadRequest("Failed to decline review");
        }

        [HttpPost("{articleId}/submit")]
        public async Task<ActionResult> SubmitReview(int articleId, [FromBody] SubmitReviewDto dto)
        {
            var result = await _reviewService.SubmitReview(articleId, dto.ReviewerId, dto.Text, dto.Status);
            return result ? Ok() : BadRequest("Failed to submit review");
        }
    }
}
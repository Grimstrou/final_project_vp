using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
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
        public async Task<ActionResult<List<Review>>> GetReviewerReviews(int reviewerId)
        {
            var reviews = await _reviewService.GetReviewerReviews(reviewerId);
            return Ok(reviews);
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

        private ActionResult HandleResult(bool success, string errorMessage)
        {
            return success ? Ok() : NotFound(errorMessage);
        }
    }
}
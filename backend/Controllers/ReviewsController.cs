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
            var result = await _reviewService.UpdateReviewStatus(id, status);
            if (result)
                return Ok();
            return NotFound("Review not found");
        }

        [HttpPut("{id}/accept")]
        public async Task<ActionResult> AcceptReview(int id)
        {
            var result = await _reviewService.AcceptReviewRequest(id);
            if (result)
                return Ok();
            return NotFound("Review not found");
        }

        [HttpPut("{id}/reject")]
        public async Task<ActionResult> RejectReview(int id)
        {
            var result = await _reviewService.RejectReviewRequest(id);
            if (result)
                return Ok();
            return NotFound("Review not found");
        }
    }
}
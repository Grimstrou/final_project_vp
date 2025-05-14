using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ReviewService
    {
        private readonly AppDbContext _context;

        public ReviewService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Review>> GetAllReviews()
        {
            return await _context.Reviews
                .Include(r => r.Reviewer)
                .Include(r => r.Article)
                .ToListAsync();
        }

        public async Task<List<Review>> GetReviewerReviews(int reviewerId)
        {
            return await _context.Reviews
                .Include(r => r.Reviewer)
                .Include(r => r.Article)
                .Where(r => r.ReviewerId == reviewerId)
                .ToListAsync();
        }

        public async Task<Review?> GetReviewById(int id)
        {
            return await _context.Reviews
                .Include(r => r.Reviewer)
                .Include(r => r.Article)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<bool> AddReview(Review review)
        {
            try
            {
                review.CreatedAt = DateTime.UtcNow;
                await _context.Reviews.AddAsync(review);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> UpdateReviewStatus(int reviewId, string status)
        {
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review == null)
                return false;

            review.Status = status;
            review.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AcceptReviewRequest(int reviewId)
        {
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review == null)
                return false;

            review.IsAccepted = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectReviewRequest(int reviewId)
        {
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review == null)
                return false;

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
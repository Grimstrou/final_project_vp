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

        private IQueryable<Review> GetReviewsWithIncludes()
        {
            return _context.Reviews
                .Include(r => r.Reviewer)
                .Include(r => r.Article);
        }

        public async Task<List<Review>> GetAllReviews()
        {
            return await GetReviewsWithIncludes().ToListAsync();
        }

        public async Task<List<Review>> GetReviewerReviews(int reviewerId)
        {
            return await GetReviewsWithIncludes()
                .Where(r => r.ReviewerId == reviewerId)
                .ToListAsync();
        }

        public async Task<Review?> GetReviewById(int id)
        {
            return await GetReviewsWithIncludes()
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<bool> AddReview(Review review)
        {
            review.CreatedAt = DateTime.UtcNow;
            await _context.Reviews.AddAsync(review);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateReview(int reviewId, Action<Review> updateAction)
        {
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review == null)
                return false;

            updateAction(review);
            review.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> HandleReviewRequest(int reviewId, bool accept)
        {
            if (accept)
                return await UpdateReview(reviewId, review => review.IsAccepted = true);
            
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review == null)
                return false;

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Article>> GetArticlesForReview(int reviewerId)
        {
            // Статьи, которые не были назначены этому рецензенту и имеют статус NotReviewed
            return await _context.Articles
                .Where(a => a.Status == "NotReviewed" && !a.ReviewerIds.Contains(reviewerId))
                .ToListAsync();
        }

        public async Task<bool> AcceptReview(int articleId, int reviewerId)
        {
            var article = await _context.Articles.FindAsync(articleId);
            if (article == null)
                return false;

            // Создаем новый объект Review
            var review = new Review
            {
                ArticleId = articleId,
                ReviewerId = reviewerId,
                Status = "InProgress",
                IsAccepted = true,
                Content = string.Empty
            };

            // Добавляем рецензента в список и обновляем статус статьи
            if (!article.ReviewerIds.Contains(reviewerId))
                article.ReviewerIds.Add(reviewerId);
            article.Status = "InProgress";

            // Сохраняем изменения
            await _context.Reviews.AddAsync(review);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeclineReview(int articleId, int reviewerId)
        {
            var article = await _context.Articles.FindAsync(articleId);
            if (article == null)
                return false;
            article.ReviewerIds.Remove(reviewerId);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SubmitReview(int articleId, int reviewerId, string content, string status)
        {
            var review = await _context.Reviews.FirstOrDefaultAsync(r => r.ArticleId == articleId && r.ReviewerId == reviewerId);
            if (review == null)
                return false;

            review.Content = content;
            review.Status = status;
            review.UpdatedAt = DateTime.UtcNow;

            var article = await _context.Articles
                .Include(a => a.Reviews)
                .FirstOrDefaultAsync(a => a.Id == articleId);

            if (article?.Reviews != null)
            {
                var newStatus = article.Reviews.Any(r => r.Status == "accepted_for_publication") 
                    ? "accepted_for_publication" 
                    : article.Reviews.Any(r => r.Status == "rejected") 
                        ? "rejected" 
                        : article.Status;

                if (newStatus != article.Status)
                {
                    article.Status = newStatus;
                    article.UpdatedAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
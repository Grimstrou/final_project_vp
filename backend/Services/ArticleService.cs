using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ArticleService
    {
        private readonly AppDbContext _context;

        public ArticleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Article>> GetAllArticles()
        {
            return await _context.Articles
                .Include(a => a.Author)
                .Include(a => a.Reviews)
                .ToListAsync();
        }

        public async Task<List<Article>> GetAuthorArticles(int authorId)
        {
            return await _context.Articles
                .Include(a => a.Author)
                .Include(a => a.Reviews)
                .Where(a => a.AuthorId == authorId)
                .ToListAsync();
        }

        public async Task<Article?> GetArticleById(int id)
        {
            return await _context.Articles
                .Include(a => a.Author)
                .Include(a => a.Reviews)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<bool> AddArticle(Article article)
        {
            article.CreatedAt = DateTime.UtcNow;
            await _context.Articles.AddAsync(article);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateArticle(int articleId, Action<Article> updateAction)
        {
            var article = await _context.Articles.FindAsync(articleId);
            if (article == null)
                return false;

            updateAction(article);
            article.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteArticle(int articleId)
        {
            var article = await _context.Articles.FindAsync(articleId);
            if (article == null)
                return false;

            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AssignReviewers(int articleId, List<int> reviewerIds)
        {
            var article = await _context.Articles.FindAsync(articleId);
            if (article == null)
                return false;

            article.ReviewerIds = reviewerIds;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
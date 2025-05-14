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
                .ToListAsync();
        }

        public async Task<List<Article>> GetAuthorArticles(int authorId)
        {
            return await _context.Articles
                .Include(a => a.Author)
                .Where(a => a.AuthorId == authorId)
                .ToListAsync();
        }

        public async Task<Article?> GetArticleById(int id)
        {
            return await _context.Articles
                .Include(a => a.Author)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<bool> AddArticle(Article article)
        {
            try
            {
                article.CreatedAt = DateTime.UtcNow;
                await _context.Articles.AddAsync(article);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> UpdateArticleStatus(int articleId, string status)
        {
            var article = await _context.Articles.FindAsync(articleId);
            if (article == null)
                return false;

            article.Status = status;
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
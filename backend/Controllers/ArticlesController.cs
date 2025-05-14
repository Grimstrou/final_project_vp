using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticlesController : ControllerBase
    {
        private readonly ArticleService _articleService;

        public ArticlesController(ArticleService articleService)
        {
            _articleService = articleService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Article>>> GetAllArticles()
        {
            var articles = await _articleService.GetAllArticles();
            return Ok(articles);
        }

        [HttpGet("author/{authorId}")]
        public async Task<ActionResult<List<Article>>> GetAuthorArticles(int authorId)
        {
            var articles = await _articleService.GetAuthorArticles(authorId);
            return Ok(articles);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Article>> GetArticle(int id)
        {
            var article = await _articleService.GetArticleById(id);
            if (article == null)
                return NotFound();
            return Ok(article);
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
            var result = await _articleService.UpdateArticleStatus(id, status);
            if (result)
                return Ok();
            return NotFound("Article not found");
        }

        [HttpPut("{id}/reviewers")]
        public async Task<ActionResult> AssignReviewers(int id, [FromBody] List<int> reviewerIds)
        {
            var result = await _articleService.AssignReviewers(id, reviewerIds);
            if (result)
                return Ok();
            return NotFound("Article not found");
        }
    }
}
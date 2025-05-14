using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly ArticleService _articleService;

        public AdminController(AuthService authService, ArticleService articleService)
        {
            _authService = authService;
            _articleService = articleService;
        }

        [HttpGet("users")]
        public async Task<ActionResult<List<User>>> GetAllUsers()
        {
            var users = await _authService.GetAllUsers();
            return Ok(users);
        }

        [HttpPost("users")]
        public async Task<ActionResult<User>> CreateUser([FromBody] User user)
        {
            var result = await _authService.Register(user);
            if (result)
                return Ok(user);
            return BadRequest("Failed to create user");
        }

        [HttpPut("users/{id}/block")]
        public async Task<ActionResult> BlockUser(int id)
        {
            var result = await _authService.BlockUser(id);
            if (result)
                return Ok();
            return NotFound("User not found");
        }

        [HttpDelete("users/{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var result = await _authService.DeleteUser(id);
            if (result)
                return Ok();
            return NotFound("User not found");
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            var user = await _authService.GetUserById(id);
            if (user == null)
                return NotFound();
            return Ok(user);
        }

        [HttpGet("articles")]
        public async Task<ActionResult<List<Article>>> GetAllArticles()
        {
            var articles = await _articleService.GetAllArticles();
            return Ok(articles);
        }

        [HttpDelete("articles/{id}")]
        public async Task<ActionResult> DeleteArticle(int id)
        {
            var result = await _articleService.DeleteArticle(id);
            if (result)
                return Ok();
            return NotFound("Article not found");
        }
    }
} 
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    public class AdminController : BaseController
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

        [HttpPut("users/{id}")]
        public async Task<ActionResult> UpdateUserStatus(int id, [FromBody] bool shouldDelete)
        {
            var result = await _authService.UpdateUserStatus(id, shouldDelete);
            return HandleResult(result, "User not found");
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
            return HandleResult(result, "Article not found");
        }

        [HttpDelete("users/{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var result = await _authService.DeleteUser(id);
            return HandleResult(result, "User not found");
        }

        [HttpPatch("users/{id}/status")]
        public async Task<ActionResult> ChangeUserStatus(int id, [FromBody] StatusDto dto)
        {
            var result = await _authService.ChangeUserStatus(id, dto.Status);
            return HandleResult(result, "User not found");
        }

        [HttpPatch("users/{id}")]
        public async Task<ActionResult> UpdateUserProfile(int id, [FromBody] User updatedUser)
        {
            var result = await _authService.UpdateUserProfile(id, updatedUser);
            return HandleResult(result, "User not found");
        }

        public class StatusDto
        {
            public string Status { get; set; } = string.Empty;
        }

        protected new ActionResult HandleResult(bool result, string errorMessage)
        {
            if (!result)
                return BadRequest(errorMessage);
            return Ok();
        }
    }
} 
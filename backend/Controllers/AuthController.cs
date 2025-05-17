using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    public class AuthController : BaseController
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register([FromBody] User user)
        {
            var result = await _authService.Register(user);
            if (result)
                return Ok(user);
            return BadRequest("Failed to register user");
        }

        [HttpPost("login")]
        public async Task<ActionResult<User>> Login([FromBody] LoginDto dto)
        {
            var (user, error) = await _authService.LoginUser(dto.Email, dto.Password, dto.Role);
            if (user == null)
            {
                if (error == "Role mismatch")
                    return BadRequest("Role does not match user role in database");
                if (error == "Invalid password")
                    return Unauthorized("Invalid password");
                return NotFound("User not found");
            }
            return Ok(user);
        }

        public class LoginDto
        {
            public string Email { get; set; }
            public string Password { get; set; }
            public string Role { get; set; }
        }
    }
}
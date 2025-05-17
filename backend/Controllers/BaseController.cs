using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class BaseController : ControllerBase
    {
        protected ActionResult HandleResult(bool success, string errorMessage)
        {
            return success ? Ok() : NotFound(errorMessage);
        }
    }
} 
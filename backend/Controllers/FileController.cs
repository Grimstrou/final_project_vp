using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace backend.Controllers
{
    public class FileController : BaseController
    {
        private readonly IWebHostEnvironment _environment;
        private const string UPLOADS_FOLDER = "uploads";
        private static readonly string[] ALLOWED_EXTENSIONS = { ".pdf", ".docx" };

        public FileController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!ALLOWED_EXTENSIONS.Contains(extension))
                return BadRequest($"Only {string.Join(", ", ALLOWED_EXTENSIONS)} files are allowed");

            var fileName = $"{Guid.NewGuid()}{extension}";
            var uploadsFolder = Path.Combine(_environment.WebRootPath, UPLOADS_FOLDER);
            Directory.CreateDirectory(uploadsFolder);

            var filePath = Path.Combine(uploadsFolder, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { filePath = $"/{UPLOADS_FOLDER}/{fileName}" });
        }

        [HttpGet("download/{fileName}")]
        public IActionResult DownloadFile(string fileName)
        {
            var filePath = Path.Combine(_environment.WebRootPath, UPLOADS_FOLDER, fileName);
            if (!System.IO.File.Exists(filePath))
                return NotFound("File not found");

            var memory = new MemoryStream();
            using (var stream = new FileStream(filePath, FileMode.Open))
            {
                stream.CopyTo(memory);
            }
            memory.Position = 0;

            return File(memory, "APPLICATION/octet-stream", fileName);
        }
    }
} 
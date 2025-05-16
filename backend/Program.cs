using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services.AddControllers();

// Добавляем CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Configure database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register services
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ArticleService>();
builder.Services.AddScoped<ReviewService>();

var app = builder.Build();

// Configure middleware
app.UseCors("AllowAll");

// Используем статические файлы
app.UseStaticFiles();

// Настраиваем маршрутизацию
app.MapControllers();

// Приветствие на корневом адресе
app.MapGet("/", () => "Welcome to the Article Review API!");

app.Run();
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Article> Articles { get; set; } = null!;
        public DbSet<Review> Reviews { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Role).HasDefaultValue("Author");
                entity.Property(e => e.IsBlocked).HasDefaultValue(false);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configure Article entity
            modelBuilder.Entity<Article>(entity =>
            {
                entity.Property(e => e.Status).HasDefaultValue("Draft");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configure Review entity
            modelBuilder.Entity<Review>(entity =>
            {
                entity.Property(e => e.Status).HasDefaultValue("Pending");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Seed initial admin user
            modelBuilder.Entity<User>().HasData(
                new User 
                { 
                    Id = 1, 
                    FirstName = "Admin", 
                    LastName = "Admin", 
                    Email = "admin@example.com", 
                    PasswordHash = "hashed_password", 
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                }
            );

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Article)
                .WithMany(a => a.Reviews)
                .HasForeignKey(r => r.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
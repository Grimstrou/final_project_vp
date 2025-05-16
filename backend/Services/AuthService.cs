using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;

        public AuthService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<bool> Register(User user)
        {
            if (await GetUserByEmail(user.Email) != null)
                return false;

            user.CreatedAt = DateTime.UtcNow;
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateUser(int userId, Action<User> updateAction)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;

            updateAction(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateUserStatus(int userId, bool shouldDelete)
        {
            if (shouldDelete)
                return await UpdateUser(userId, user => _context.Users.Remove(user));
            
            return await UpdateUser(userId, user => user.IsBlocked = true);
        }

        public async Task<User?> GetUserById(int id)
        {
            return await _context.Users.FindAsync(id);
        }
    }
}
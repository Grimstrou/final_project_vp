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
                return await DeleteUser(userId);
            
            return await UpdateUser(userId, user => user.IsBlocked = true);
        }

        public async Task<User?> GetUserById(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<bool> DeleteUser(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ChangeUserStatus(int userId, string status)
        {
            return await UpdateUser(userId, user => 
            {
                user.Status = status;
                user.IsBlocked = status == "inactive";
            });
        }

        public async Task<bool> UpdateUserProfile(int userId, User updatedUser)
        {
            return await UpdateUser(userId, user => 
            {
                user.FirstName = updatedUser.FirstName;
                user.LastName = updatedUser.LastName;
                user.Email = updatedUser.Email;
                user.Specialization = updatedUser.Specialization;
                user.Location = updatedUser.Location;
                user.Bio = updatedUser.Bio;
            });
        }

        public async Task<(User? user, string error)> LoginUser(string email, string password, string role)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            
            if (user == null)
                return (null, "User not found");
                
            if (user.IsBlocked)
                return (null, "User is blocked");
                
            if (user.PasswordHash != password)
                return (null, "Invalid password");
                
            if (user.Role != role)
                return (null, "Role mismatch");
                
            return (user, "");
        }
    }
}
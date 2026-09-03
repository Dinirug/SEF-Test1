using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IJwtService _jwtService;

        public AuthService(AppDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            // Validate passwords match
            if (dto.Password != dto.ConfirmPassword)
                throw new ArgumentException("Password and Confirm Password do not match.");

            // Validate password complexity
            if (!ValidatePasswordComplexity(dto.Password))
                throw new ArgumentException("Password must be at least 8 characters with uppercase, lowercase, and a number.");

            var normalizedEmail = dto.Email.Trim().ToLower();

            // Block admin registration
            if (normalizedEmail == "admin@gmail.com")
                throw new ArgumentException("Admin registration is not allowed.");

            // Check for duplicate email
            var existing = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);
            if (existing != null)
                throw new ArgumentException("A user with this email address already exists.");

            // Validate phone number is exactly 10 digits
            var phone = dto.PhoneNumber?.Trim() ?? "";
            if (phone.Length != 10 || !phone.All(char.IsDigit))
                throw new ArgumentException("Phone number must be exactly 10 digits.");

            // Hash password with BCrypt
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var newUser = new User
            {
                FullName = dto.FullName.Trim(),
                Email = normalizedEmail,
                PasswordHash = passwordHash,
                PhoneNumber = phone,
                Age = dto.Age,
                Role = "User",
                CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc)
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateToken(newUser, out var expiration);

            return new AuthResponseDto
            {
                Token = token,
                Expiration = expiration,
                User = MapUserDto(newUser)
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var normalizedEmail = dto.Email?.Trim().ToLower() ?? "";
            var password = dto.Password?.Trim() ?? "";

            // Hardcoded Admin check
            if (normalizedEmail == "admin@gmail.com" && password.Equals("Admin@123", StringComparison.OrdinalIgnoreCase))
            {
                var adminUser = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == "admin@gmail.com");
                if (adminUser == null)
                {
                    adminUser = new User
                    {
                        FullName = "System Administrator",
                        Email = "admin@gmail.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                        PhoneNumber = "0000000000",
                        Age = 0,
                        Role = "Admin",
                        CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc)
                    };
                    _context.Users.Add(adminUser);
                    await _context.SaveChangesAsync();
                }

                var adminToken = _jwtService.GenerateToken(adminUser, out var adminExpiration);
                return new AuthResponseDto
                {
                    Token = adminToken,
                    Expiration = adminExpiration,
                    User = new UserDto
                    {
                        Id = adminUser.Id,
                        FullName = adminUser.FullName,
                        Email = "Admin@gmail.com",
                        PhoneNumber = adminUser.PhoneNumber,
                        Age = adminUser.Age,
                        Role = "Admin",
                        CreatedAt = adminUser.CreatedAt
                    }
                };
            }

            // Standard user login
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);
            if (user == null)
                throw new UnauthorizedAccessException("Invalid email or password.");

            if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid email or password.");

            var token = _jwtService.GenerateToken(user, out var expiration);

            return new AuthResponseDto
            {
                Token = token,
                Expiration = expiration,
                User = MapUserDto(user)
            };
        }

        private static UserDto MapUserDto(User user) => new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Age = user.Age,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        };

        private static bool ValidatePasswordComplexity(string password)
        {
            if (string.IsNullOrWhiteSpace(password) || password.Length < 8) return false;
            return password.Any(char.IsUpper) && password.Any(char.IsLower) && password.Any(char.IsDigit);
        }
    }
}

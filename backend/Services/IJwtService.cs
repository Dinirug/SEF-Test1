using backend.Models;

namespace backend.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user, out DateTime expiration);
    }
}

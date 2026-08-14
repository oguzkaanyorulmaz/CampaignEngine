using CampaignPanel.Application.Services;
using CampaignPanel.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace CampaignPanel.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly CampaignPanelDbContext _db;

        public UserRepository(CampaignPanelDbContext db)
        {
            _db = db;
        }

        public async Task<(bool Success, string FullName)> ValidateUserAsync(string username, string password)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null) return (false, string.Empty);

            // FraudGuard kullanıcıları SHA256 hash kullanıyor
            var inputHash = ComputeSha256Hash(password);

            if (user.PasswordUnderSHA256 == inputHash)
            {
                return (true, user.Username);
            }

            return (false, string.Empty);
        }

        private static string ComputeSha256Hash(string rawData)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(rawData));
            return Convert.ToBase64String(bytes);
        }
    }
}

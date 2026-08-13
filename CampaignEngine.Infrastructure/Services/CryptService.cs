using System;
using System.Security.Cryptography;
using System.Text;
using CampaignEngine.Domain.Interfaces.Abstractions;

namespace CampaignEngine.Infrastructure.Services
{
    public class CryptService : ICryptService
    {
        private const int SaltSize = 16; // 128 bit
        private const int KeySize = 32;  // 256 bit
        private const int Iterations = 100000;

        public string HashPassword(string password)
        {
            byte[] salt = RandomNumberGenerator.GetBytes(SaltSize);
            byte[] hash = Rfc2898DeriveBytes.Pbkdf2(
                password,
                salt,
                Iterations,
                HashAlgorithmName.SHA256,
                KeySize
            );
            return $"PBKDF2${Iterations}${Convert.ToBase64String(salt)}${Convert.ToBase64String(hash)}";
        }

        public bool VerifyPassword(string password, string hashedPassword)
        {
            if (string.IsNullOrEmpty(hashedPassword)) return false;

            // Fallback: SHA256 legacy hash
            if (!hashedPassword.StartsWith("PBKDF2$"))
            {
                using var sha256 = SHA256.Create();
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                string legacyHash = Convert.ToBase64String(hashedBytes);
                return legacyHash == hashedPassword;
            }

            var parts = hashedPassword.Split('$');
            if (parts.Length != 5) return false;

            try
            {
                int iterations = int.Parse(parts[2]);
                byte[] salt = Convert.FromBase64String(parts[3]);
                byte[] hash = Convert.FromBase64String(parts[4]);

                byte[] newHash = Rfc2898DeriveBytes.Pbkdf2(
                    password,
                    salt,
                    iterations,
                    HashAlgorithmName.SHA256,
                    hash.Length
                );

                return CryptographicOperations.FixedTimeEquals(hash, newHash);
            }
            catch
            {
                return false;
            }
        }
    }
}

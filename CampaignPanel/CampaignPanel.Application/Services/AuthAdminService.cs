using CampaignPanel.Application.DTOs;
using CampaignPanel.Application.Interfaces;

namespace CampaignPanel.Application.Services
{
    /// <summary>
    /// Auth service — FraudGuard DB Users tablosundan doğrulama yapar.
    /// Gerçek implementasyon Infrastructure katmanında, burada interface bridge.
    /// </summary>
    public interface IUserRepository
    {
        Task<(bool Success, string FullName)> ValidateUserAsync(string username, string password);
    }

    public class AuthAdminService : IAuthAdminService
    {
        private readonly IUserRepository _userRepo;

        public AuthAdminService(IUserRepository userRepo)
        {
            _userRepo = userRepo;
        }

        public async Task<AdminLoginResultDto> LoginAsync(AdminLoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return new AdminLoginResultDto
                {
                    Success = false,
                    ErrorMessage = "Kullanıcı adı ve şifre gereklidir."
                };
            }

            var (success, fullName) = await _userRepo.ValidateUserAsync(dto.Username, dto.Password);

            if (!success)
            {
                return new AdminLoginResultDto
                {
                    Success = false,
                    ErrorMessage = "Geçersiz kullanıcı adı veya şifre."
                };
            }

            // Simple token — production'da JWT kullanılmalı
            var token = Convert.ToBase64String(
                System.Text.Encoding.UTF8.GetBytes($"{dto.Username}:{DateTime.UtcNow.Ticks}")
            );

            return new AdminLoginResultDto
            {
                Success = true,
                Token = token,
                FullName = fullName
            };
        }
    }
}

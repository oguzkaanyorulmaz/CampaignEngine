using CampaignPanel.Application.DTOs;

namespace CampaignPanel.Application.Interfaces
{
    public interface ICampaignAdminService
    {
        Task<List<CampaignDto>> GetAllCampaignsAsync();
        Task<CampaignDto?> GetCampaignByIdAsync(int campaignId);
        Task<CampaignDto> CreateCampaignAsync(CreateCampaignDto dto);
        Task<CampaignDto> UpdateCampaignAsync(UpdateCampaignDto dto);
        Task<bool> DeleteCampaignAsync(int campaignId);
        Task<DashboardStatsDto> GetDashboardStatsAsync();
    }

    public interface IAuthAdminService
    {
        Task<AdminLoginResultDto> LoginAsync(AdminLoginDto dto);
    }
}

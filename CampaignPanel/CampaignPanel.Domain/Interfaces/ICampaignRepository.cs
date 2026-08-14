using CampaignPanel.Domain.Entities;

namespace CampaignPanel.Domain.Interfaces
{
    public interface ICampaignRepository
    {
        Task<List<Campaign>> GetAllCampaignsAsync();
        Task<Campaign?> GetCampaignByIdAsync(int campaignId);
        Task<Campaign> CreateCampaignAsync(Campaign campaign);
        Task<Campaign> UpdateCampaignAsync(Campaign campaign);
        Task<bool> DeleteCampaignAsync(int campaignId);
        Task<int> GetActiveCampaignCountAsync();
        Task<int> GetTotalParticipantCountAsync();
    }
}

using System.Collections.Generic;
using System.Threading.Tasks;
using CampaignEngine.Domain.Entities;

namespace CampaignEngine.Domain.Interfaces.Repositories
{
    public interface ICampaignRepository
    {
        Task<List<Campaign>> GetActiveCampaignsAsync();
        Task<Campaign?> GetCampaignByCodeAsync(string ruleCode);
        Task<bool> JoinCampaignAsync(int customerId, int campaignId);
        Task<bool> RedeemCampaignAsync(int customerId, int campaignId, decimal savedAmount, int? creditCardId = null, string? location = null, string? country = null);
        Task<List<CustomerCampaignParticipation>> GetCustomerParticipationsAsync(int customerId);
    }
}

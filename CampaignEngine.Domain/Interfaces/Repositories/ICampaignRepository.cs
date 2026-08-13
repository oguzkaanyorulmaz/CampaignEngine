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
        Task<List<CustomerCampaignParticipation>> GetCustomerParticipationsAsync(int customerId);
    }
}

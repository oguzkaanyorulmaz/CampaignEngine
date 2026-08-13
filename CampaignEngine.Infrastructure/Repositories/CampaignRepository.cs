using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CampaignEngine.Domain.Entities;
using CampaignEngine.Domain.Interfaces.Repositories;
using CampaignEngine.Infrastructure.Persistence.Contexts;

namespace CampaignEngine.Infrastructure.Repositories
{
    public class CampaignRepository : ICampaignRepository
    {
        private readonly CampaignEngineDbContext _db;

        public CampaignRepository(CampaignEngineDbContext db)
        {
            _db = db;
        }

        public async Task<List<Campaign>> GetActiveCampaignsAsync()
        {
            return await _db.Campaigns.Where(c => c.IsActive).ToListAsync();
        }

        public async Task<Campaign?> GetCampaignByCodeAsync(string ruleCode)
        {
            return await _db.Campaigns.FirstOrDefaultAsync(c => c.RuleCode == ruleCode && c.IsActive);
        }

        public async Task<bool> JoinCampaignAsync(int customerId, int campaignId)
        {
            var exists = await _db.Participations.AnyAsync(p => p.CustomerId == customerId && p.CampaignId == campaignId);
            if (exists) return true;

            _db.Participations.Add(new CustomerCampaignParticipation
            {
                CustomerId = customerId,
                CampaignId = campaignId,
                JoinedDate = DateTime.UtcNow,
                IsRedeemed = false,
                TotalSavedAmount = 0
            });

            return await _db.SaveChangesAsync() > 0;
        }

        public async Task<List<CustomerCampaignParticipation>> GetCustomerParticipationsAsync(int customerId)
        {
            return await _db.Participations
                .Include(p => p.Campaign)
                .Where(p => p.CustomerId == customerId)
                .ToListAsync();
        }
    }
}

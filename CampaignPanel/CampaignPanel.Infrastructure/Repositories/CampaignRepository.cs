using CampaignPanel.Domain.Entities;
using CampaignPanel.Domain.Enums;
using CampaignPanel.Domain.Interfaces;
using CampaignPanel.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CampaignPanel.Infrastructure.Repositories
{
    public class CampaignRepository : ICampaignRepository
    {
        private readonly CampaignPanelDbContext _db;

        public CampaignRepository(CampaignPanelDbContext db)
        {
            _db = db;
        }

        public async Task<List<Campaign>> GetAllCampaignsAsync()
        {
            return await _db.Campaigns
                .Include(c => c.Rule)
                .Include(c => c.Targeting)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<Campaign?> GetCampaignByIdAsync(int campaignId)
        {
            return await _db.Campaigns
                .Include(c => c.Rule)
                .Include(c => c.Targeting)
                .FirstOrDefaultAsync(c => c.CampaignId == campaignId);
        }

        public async Task<Campaign> CreateCampaignAsync(Campaign campaign)
        {
            _db.Campaigns.Add(campaign);
            await _db.SaveChangesAsync();
            return campaign;
        }

        public async Task<Campaign> UpdateCampaignAsync(Campaign campaign)
        {
            campaign.UpdatedAt = DateTime.UtcNow;
            _db.Campaigns.Update(campaign);
            await _db.SaveChangesAsync();
            return campaign;
        }

        public async Task<bool> DeleteCampaignAsync(int campaignId)
        {
            var campaign = await _db.Campaigns.FindAsync(campaignId);
            if (campaign == null) return false;
            _db.Campaigns.Remove(campaign);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<int> GetActiveCampaignCountAsync()
        {
            return await _db.Campaigns.CountAsync(c => c.Status == CampaignStatus.Active && c.EndDate >= DateTime.UtcNow);
        }

        public async Task<int> GetTotalParticipantCountAsync()
        {
            // Şimdilik aktif kampanya sayısına göre bir tahmin.
            // İleride CampaignParticipations tablosu eklendiğinde burası güncellenecek.
            return await _db.Campaigns.CountAsync(c => c.Status == CampaignStatus.Active) * 3;
        }
    }
}

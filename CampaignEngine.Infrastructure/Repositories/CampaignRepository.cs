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
        private readonly FraudGuardReadOnlyDbContext _db;

        public CampaignRepository(FraudGuardReadOnlyDbContext db)
        {
            _db = db;
        }

        public async Task<List<Campaign>> GetActiveCampaignsAsync()
        {
            var now = DateTime.UtcNow;
            var dbCampaigns = await _db.Campaigns
                .Include(c => c.Rule)
                .Include(c => c.Targeting)
                .Where(c => c.Status == 1 && c.StartDate <= now && c.EndDate >= now)
                .ToListAsync();

            return dbCampaigns.Select(MapToDomain).ToList();
        }

        public async Task<Campaign?> GetCampaignByCodeAsync(string ruleCode)
        {
            var now = DateTime.UtcNow;
            var c = await _db.Campaigns
                .Include(c => c.Rule)
                .Include(c => c.Targeting)
                .FirstOrDefaultAsync(c => c.Status == 1 && c.StartDate <= now && c.EndDate >= now);

            return c == null ? null : MapToDomain(c);
        }

        public async Task<bool> JoinCampaignAsync(int customerId, int campaignId)
        {
            var exists = await _db.CampaignParticipations
                .AnyAsync(p => p.CustomerId == customerId && p.CampaignId == campaignId);
            
            if (exists) return true;

            _db.CampaignParticipations.Add(new ECampaignParticipation
            {
                CustomerId = customerId,
                CampaignId = campaignId,
                JoinedDate = DateTime.UtcNow,
                IsRedeemed = false,
                TotalSavedAmount = 0
            });

            return await _db.SaveChangesAsync() > 0;
        }

        public async Task<bool> RedeemCampaignAsync(int customerId, int campaignId, decimal savedAmount, int? creditCardId = null, string? location = null, string? country = null)
        {
            var participation = await _db.CampaignParticipations
                .FirstOrDefaultAsync(p => p.CustomerId == customerId && p.CampaignId == campaignId);

            if (participation == null) return false;

            participation.IsRedeemed = true;
            participation.TotalSavedAmount = savedAmount;
            await _db.SaveChangesAsync();

            // Kart limiti ve iade işlemini otomatik FraudGuard veritabanına işle
            if (creditCardId.HasValue && savedAmount > 0)
            {
                try
                {
                    string rrn = DateTime.UtcNow.ToString("yyMMddHHmmss") + new Random().Next(10, 99);
                    string txnLocation = string.IsNullOrWhiteSpace(location) ? "Ankara" : location;
                    string txnCountry = string.IsNullOrWhiteSpace(country) ? "Türkiye" : country;

                    await _db.Database.ExecuteSqlRawAsync(@"
                        UPDATE CreditCards 
                        SET AvailableLimit = AvailableLimit + {0} 
                        WHERE CardId = {1};

                        IF NOT EXISTS (SELECT 1 FROM CreditCardTransactions WHERE CreditCardId = {1} AND MerchantCategory LIKE N'%Kampanya%İade%' AND TransactionDate >= DATEADD(minute, -10, GETUTCDATE()))
                        BEGIN
                            INSERT INTO CreditCardTransactions (RRN, CreditCardId, TransactionTypeId, ChannelTypeId, Currency, Amount, TransactionDate, Location, Country, MerchantCategory, Status)
                            VALUES ({2}, {1}, 2, 2, 'TRY', {0}, GETUTCDATE(), {3}, {4}, N'🎁 Kampanya Nakit İadesi (CashBack)', 'Approved');
                        END
                    ", savedAmount, creditCardId.Value, rrn, txnLocation, txnCountry);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[RedeemCampaignAsync] CreditCard refund error: {ex.Message}");
                }
            }

            return true;
        }

        public async Task<List<CustomerCampaignParticipation>> GetCustomerParticipationsAsync(int customerId)
        {
            var participations = await _db.CampaignParticipations
                .Include(p => p.Campaign)
                .Where(p => p.CustomerId == customerId)
                .ToListAsync();

            return participations.Select(p => new CustomerCampaignParticipation
            {
                ParticipationId = p.ParticipationId,
                CustomerId = p.CustomerId,
                CampaignId = p.CampaignId,
                JoinedDate = p.JoinedDate,
                IsRedeemed = p.IsRedeemed,
                TotalSavedAmount = p.TotalSavedAmount
            }).ToList();
        }

        private static Campaign MapToDomain(ECampaign c) => new()
        {
            CampaignId = c.CampaignId,
            Title = c.Title,
            Description = c.Description ?? string.Empty,
            BenefitDescription = c.BenefitDescription ?? string.Empty,
            MinimumSpendAmount = c.Rule?.MinSpendAmount ?? 0,
            DiscountPercent = c.Rule?.DiscountPercent ?? 0,
            MaxDiscountAmount = c.Rule?.MaxDiscountAmount ?? 0,
            Category = c.Rule?.Category ?? 0,
            MinTransactionCount = c.Rule?.MinTransactionCount ?? 0,
            LookbackMonths = c.Rule?.LookbackMonths ?? 1,
            CardTypeCondition = c.Rule?.CardTypeCondition ?? "All",
            BenefitType = c.Rule?.BenefitType ?? "Discount",
            TargetingType = c.Targeting?.TargetingType ?? 0,
            CardBINs = c.Targeting?.CardBINs,
            CustomerIds = c.Targeting?.CustomerIds,
            PriorityWeight = (int)(c.Rule?.DiscountPercent ?? 10),
            IsActive = c.Status == 1,
            CreatedDate = c.CreatedAt,
            ValidUntil = c.EndDate
        };
    }
}

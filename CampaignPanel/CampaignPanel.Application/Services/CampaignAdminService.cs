using CampaignPanel.Application.DTOs;
using CampaignPanel.Application.Interfaces;
using CampaignPanel.Domain.Entities;
using CampaignPanel.Domain.Enums;
using CampaignPanel.Domain.Interfaces;

namespace CampaignPanel.Application.Services
{
    public class CampaignAdminService : ICampaignAdminService
    {
        private readonly ICampaignRepository _repo;

        public CampaignAdminService(ICampaignRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<CampaignDto>> GetAllCampaignsAsync()
        {
            var campaigns = await _repo.GetAllCampaignsAsync();
            return campaigns.Select(MapToDto).ToList();
        }

        public async Task<CampaignDto?> GetCampaignByIdAsync(int campaignId)
        {
            var campaign = await _repo.GetCampaignByIdAsync(campaignId);
            return campaign == null ? null : MapToDto(campaign);
        }

        public async Task<CampaignDto> CreateCampaignAsync(CreateCampaignDto dto)
        {
            var campaign = new Campaign
            {
                Title = dto.Title,
                Description = dto.Description,
                BenefitDescription = dto.BenefitDescription,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Status = CampaignStatus.Active,
                CreatedAt = DateTime.UtcNow,
                Rule = new CampaignRule
                {
                    DiscountPercent = dto.DiscountPercent,
                    MinSpendAmount = dto.MinSpendAmount,
                    MaxDiscountAmount = dto.MaxDiscountAmount,
                    Category = Enum.TryParse<SpendCategory>(dto.Category, true, out var cat) ? cat : SpendCategory.All,
                    MinTransactionCount = dto.MinTransactionCount,
                    LookbackMonths = dto.LookbackMonths > 0 ? dto.LookbackMonths : 1,
                    CardTypeCondition = string.IsNullOrWhiteSpace(dto.CardTypeCondition) ? "All" : dto.CardTypeCondition,
                    BenefitType = string.IsNullOrWhiteSpace(dto.BenefitType) ? "Discount" : dto.BenefitType
                },
                Targeting = new CampaignTargeting
                {
                    TargetingType = Enum.TryParse<TargetingType>(dto.TargetingType, true, out var tt) ? tt : TargetingType.All,
                    CardBINs = dto.CardBINs,
                    CustomerIds = dto.CustomerIds
                }
            };

            var created = await _repo.CreateCampaignAsync(campaign);
            return MapToDto(created);
        }

        public async Task<CampaignDto> UpdateCampaignAsync(UpdateCampaignDto dto)
        {
            var campaign = await _repo.GetCampaignByIdAsync(dto.CampaignId);
            if (campaign == null) throw new Exception("Kampanya bulunamadı.");

            campaign.Title = dto.Title;
            campaign.Description = dto.Description;
            campaign.BenefitDescription = dto.BenefitDescription;
            campaign.StartDate = dto.StartDate;
            campaign.EndDate = dto.EndDate;
            campaign.Status = Enum.TryParse<CampaignStatus>(dto.Status, true, out var st) ? st : CampaignStatus.Active;
            campaign.UpdatedAt = DateTime.UtcNow;

            if (campaign.Rule != null)
            {
                campaign.Rule.DiscountPercent = dto.DiscountPercent;
                campaign.Rule.MinSpendAmount = dto.MinSpendAmount;
                campaign.Rule.MaxDiscountAmount = dto.MaxDiscountAmount;
                campaign.Rule.Category = Enum.TryParse<SpendCategory>(dto.Category, true, out var cat) ? cat : SpendCategory.All;
                campaign.Rule.MinTransactionCount = dto.MinTransactionCount;
                campaign.Rule.LookbackMonths = dto.LookbackMonths > 0 ? dto.LookbackMonths : 1;
                campaign.Rule.CardTypeCondition = string.IsNullOrWhiteSpace(dto.CardTypeCondition) ? "All" : dto.CardTypeCondition;
                campaign.Rule.BenefitType = string.IsNullOrWhiteSpace(dto.BenefitType) ? "Discount" : dto.BenefitType;
            }

            if (campaign.Targeting != null)
            {
                campaign.Targeting.TargetingType = Enum.TryParse<TargetingType>(dto.TargetingType, true, out var tt) ? tt : TargetingType.All;
                campaign.Targeting.CardBINs = dto.CardBINs;
                campaign.Targeting.CustomerIds = dto.CustomerIds;
            }

            var updated = await _repo.UpdateCampaignAsync(campaign);
            return MapToDto(updated);
        }

        public async Task<bool> DeleteCampaignAsync(int campaignId)
        {
            return await _repo.DeleteCampaignAsync(campaignId);
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var all = await _repo.GetAllCampaignsAsync();
            var activeCount = await _repo.GetActiveCampaignCountAsync();
            var participantCount = await _repo.GetTotalParticipantCountAsync();

            return new DashboardStatsDto
            {
                TotalCampaigns = all.Count,
                ActiveCampaigns = activeCount,
                TotalParticipants = participantCount,
                ExpiredCampaigns = all.Count(c => c.Status == CampaignStatus.Expired || c.EndDate < DateTime.UtcNow)
            };
        }

        private static CampaignDto MapToDto(Campaign c) => new()
        {
            CampaignId = c.CampaignId,
            Title = c.Title,
            Description = c.Description,
            BenefitDescription = c.BenefitDescription,
            StartDate = c.StartDate,
            EndDate = c.EndDate,
            Status = c.Status.ToString(),
            CreatedAt = c.CreatedAt,
            DiscountPercent = c.Rule?.DiscountPercent ?? 0,
            MinSpendAmount = c.Rule?.MinSpendAmount ?? 0,
            MaxDiscountAmount = c.Rule?.MaxDiscountAmount ?? 0,
            Category = c.Rule?.Category.ToString() ?? "All",
            MinTransactionCount = c.Rule?.MinTransactionCount ?? 0,
            LookbackMonths = c.Rule?.LookbackMonths ?? 1,
            CardTypeCondition = c.Rule?.CardTypeCondition ?? "All",
            BenefitType = c.Rule?.BenefitType ?? "Discount",
            TargetingType = c.Targeting?.TargetingType.ToString() ?? "All",
            CardBINs = c.Targeting?.CardBINs,
            CustomerIds = c.Targeting?.CustomerIds
        };
    }
}

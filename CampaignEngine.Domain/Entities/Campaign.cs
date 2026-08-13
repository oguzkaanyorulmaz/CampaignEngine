using System;
using CampaignEngine.Domain.Common.Enums;

namespace CampaignEngine.Domain.Entities
{
    public class Campaign
    {
        public int CampaignId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string BenefitDescription { get; set; } = string.Empty; // Örn: "%10 İndirim"
        public decimal MinimumSpendAmount { get; set; }
        public CampaignTypeEnum CampaignType { get; set; }
        public string RuleCode { get; set; } = string.Empty; // Kural kodu eşleşmesi için (örn: MARKET_15K)
        public int PriorityWeight { get; set; } = 1; // Kural çakışmasında ağırlık skoru
        public bool IsActive { get; set; } = true;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? ValidUntil { get; set; }
    }
}

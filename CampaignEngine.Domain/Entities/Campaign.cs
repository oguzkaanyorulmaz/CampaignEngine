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
        public decimal DiscountPercent { get; set; }
        public decimal MaxDiscountAmount { get; set; }
        public int Category { get; set; } // 0: All, 1: Fuel, 2: ECommerce, 3: Restaurant, 4: Market, 5: Travel, 6: Entertainment
        public int MinTransactionCount { get; set; } = 0;
        public int LookbackMonths { get; set; } = 1;
        public string CardTypeCondition { get; set; } = "All";
        public string BenefitType { get; set; } = "Discount";
        public int TargetingType { get; set; } // 0: All, 1: SpecificCards, 2: CustomerSegment
        public string? CardBINs { get; set; }
        public string? CustomerIds { get; set; }
        public CampaignTypeEnum CampaignType { get; set; }
        public string RuleCode { get; set; } = string.Empty;
        public int PriorityWeight { get; set; } = 1;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? ValidUntil { get; set; }
    }
}

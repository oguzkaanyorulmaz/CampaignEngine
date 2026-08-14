using CampaignPanel.Domain.Enums;

namespace CampaignPanel.Domain.Entities
{
    public class Campaign
    {
        public int CampaignId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string BenefitDescription { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public CampaignStatus Status { get; set; } = CampaignStatus.Draft;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation
        public CampaignRule? Rule { get; set; }
        public CampaignTargeting? Targeting { get; set; }
    }

    public class CampaignRule
    {
        public int RuleId { get; set; }
        public int CampaignId { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal MinSpendAmount { get; set; } // Kampanyanın kullanımı için gerekli min harcama tutarı
        public decimal MaxDiscountAmount { get; set; } // Maksimum indirim üst sınırı
        public SpendCategory Category { get; set; } = SpendCategory.All; // Hedef Sektör
        public int MinTransactionCount { get; set; } = 0; // Şart: Min işlem adedi (örn: 5 alışveriş)
        public int LookbackMonths { get; set; } = 1; // Şart: Gözlem periyodu (örn: Son 1 Ay)
        public string CardTypeCondition { get; set; } = "All"; // Şart: "All", "Credit", "Debit"
        public string BenefitType { get; set; } = "Discount"; // "Discount", "Cashback", "Points", "Installment"

        // Navigation
        public Campaign Campaign { get; set; } = null!;
    }

    public class CampaignTargeting
    {
        public int TargetId { get; set; }
        public int CampaignId { get; set; }
        public TargetingType TargetingType { get; set; } = TargetingType.All;
        public string? CardBINs { get; set; }       // Comma-separated BIN numbers
        public string? CustomerIds { get; set; }     // Comma-separated customer IDs

        // Navigation
        public Campaign Campaign { get; set; } = null!;
    }
}

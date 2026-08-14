using CampaignPanel.Domain.Enums;

namespace CampaignPanel.Application.DTOs
{
    // --- Campaign DTOs ---
    public class CampaignDto
    {
        public int CampaignId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string BenefitDescription { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = "Draft";
        public DateTime CreatedAt { get; set; }

        // Rule & Discount Details
        public decimal DiscountPercent { get; set; }
        public decimal MinSpendAmount { get; set; }
        public decimal MaxDiscountAmount { get; set; }
        public string Category { get; set; } = "All";
        public int MinTransactionCount { get; set; } = 0;
        public int LookbackMonths { get; set; } = 1;
        public string CardTypeCondition { get; set; } = "All";
        public string BenefitType { get; set; } = "Discount";

        // Targeting
        public string TargetingType { get; set; } = "All";
        public string? CardBINs { get; set; }
        public string? CustomerIds { get; set; }
    }

    public class CreateCampaignDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string BenefitDescription { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        // Rule & Discount Details
        public decimal DiscountPercent { get; set; }
        public decimal MinSpendAmount { get; set; }
        public decimal MaxDiscountAmount { get; set; }
        public string Category { get; set; } = "All";
        public int MinTransactionCount { get; set; } = 0;
        public int LookbackMonths { get; set; } = 1;
        public string CardTypeCondition { get; set; } = "All";
        public string BenefitType { get; set; } = "Discount";

        // Targeting
        public string TargetingType { get; set; } = "All";
        public string? CardBINs { get; set; }
        public string? CustomerIds { get; set; }
    }

    public class UpdateCampaignDto : CreateCampaignDto
    {
        public int CampaignId { get; set; }
        public string Status { get; set; } = "Active";
    }

    // --- Dashboard Stats ---
    public class DashboardStatsDto
    {
        public int TotalCampaigns { get; set; }
        public int ActiveCampaigns { get; set; }
        public int TotalParticipants { get; set; }
        public int ExpiredCampaigns { get; set; }
    }

    // --- Auth DTOs ---
    public class AdminLoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AdminLoginResultDto
    {
        public bool Success { get; set; }
        public string? Token { get; set; }
        public string? FullName { get; set; }
        public string? ErrorMessage { get; set; }
    }
}

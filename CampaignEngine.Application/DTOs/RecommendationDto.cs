namespace CampaignEngine.Application.DTOs
{
    public class RecommendationDto
    {
        public int CampaignId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string BenefitDescription { get; set; } = string.Empty; // Örn: "%10 İndirim"
        public string Reason { get; set; } = string.Empty;             // Örn: "Son 3 ayda Market harcamanız 18.500 TL"
        public int PriorityScore { get; set; }
        public bool IsJoined { get; set; } = false;                   // Müşteri bu kampanyaya katıldı mı?
        public bool IsRedeemed { get; set; } = false;                 // Kampanya kullanıldı mı?
        public decimal TotalSavedAmount { get; set; } = 0;            // Bu kampanyadan kazanılan toplam indirim / tutar
    }
}

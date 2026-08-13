using System;

namespace CampaignEngine.Domain.Entities
{
    public class CustomerCampaignParticipation
    {
        public int ParticipationId { get; set; }
        public int CustomerId { get; set; }
        public int CampaignId { get; set; }
        public DateTime JoinedDate { get; set; } = DateTime.UtcNow;
        public bool IsRedeemed { get; set; } = false; // Kampanya indirimi kullanıldı mı?
        public decimal TotalSavedAmount { get; set; } = 0; // Sağlanan toplam indirim/kazanç

        // Navigation Property
        public virtual Campaign Campaign { get; set; } = null!;
    }
}

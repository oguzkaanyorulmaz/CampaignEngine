using System.Collections.Generic;

namespace CampaignEngine.Application.DTOs
{
    public class CustomerDashboardDto
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        
        // Sol Panel Varlık Özeti
        public decimal TotalAccountBalance { get; set; }
        public decimal TotalCreditCardAvailableLimit { get; set; }
        
        // Banka Hesapları
        public List<BankAccountDto> BankAccounts { get; set; } = new();

        // Kredi Kartları ve İşlemleri
        public List<CreditCardDto> CreditCards { get; set; } = new();
        
        // Sağ Panel - Size Özel Önerilen Kampanya
        public RecommendationDto? RecommendedCampaign { get; set; }
    }
}

using System.Collections.Generic;

namespace CampaignEngine.Application.DTOs
{
    public class CreditCardDto
    {
        public int CreditCardId { get; set; }
        public string CardNumber { get; set; } = string.Empty; // Maskeli: **** **** **** 2696
        public string ExpiryDate { get; set; } = string.Empty;
        public decimal CardLimit { get; set; }
        public decimal AvailableLimit { get; set; }
        public bool IsBlocked { get; set; }
        public List<TransactionDto> RecentTransactions { get; set; } = new();
    }
}

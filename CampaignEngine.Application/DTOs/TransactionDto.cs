using System;

namespace CampaignEngine.Application.DTOs
{
    public class TransactionDto
    {
        public int TransactionId { get; set; }
        public string RRN { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "TRY";
        public string Location { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string MerchantCategory { get; set; } = string.Empty;
        public DateTime TransactionDate { get; set; }
        
        // İşlem Tipi Özellikleri
        public bool IsOnline { get; set; }
        public bool IsRefund { get; set; }            // ↩️ İade İşlemi (TransactionTypeId == 2)
        public bool IsSuspicious { get; set; }        // ⚠️ Şüpheli / Fraud İşlem
        public string? FraudReason { get; set; }      // Şüphe Nedeni
    }
}

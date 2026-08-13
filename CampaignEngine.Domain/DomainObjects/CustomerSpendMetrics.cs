using System.Collections.Generic;
using CampaignEngine.Domain.Common.Enums;

namespace CampaignEngine.Domain.DomainObjects
{
    /// <summary>
    /// Müşterinin son 90 gündeki harcama davranışlarının analiz sonuç modeli
    /// </summary>
    public class CustomerSpendMetrics
    {
        public int CustomerId { get; set; }
        public decimal TotalSpend90Days { get; set; }
        public int TotalTransactionCount { get; set; }
        public decimal AverageCartSize { get; set; }
        
        // Sektör bazlı harcama tutarları
        public Dictionary<CategoryEnum, decimal> CategorySpends { get; set; } = new();
        
        // En çok harcama yapılan sektör
        public CategoryEnum TopCategory { get; set; }
        public decimal TopCategorySpendAmount { get; set; }

        // Oranlar (0.00 - 1.00 arası)
        public double OnlineSpendRatio { get; set; }        // Online / Toplam İşlem Oranı
        public double InstallmentSpendRatio { get; set; }   // Taksitli İşlem Oranı
        public double WeekendSpendRatio { get; set; }       // Hafta Sonu Harcama Oranı
        
        public bool HasInternationalTransaction { get; set; } // Yurt Dışı İşlemi Var mı?
    }
}

using CampaignEngine.Domain.Common.Enums;
using CampaignEngine.Domain.DomainObjects;
using CampaignEngine.Domain.Interfaces.Rules;

namespace CampaignEngine.Domain.Services.Rules
{
    public class MarketCampaignRule : ICampaignRule
    {
        public string RuleCode => "MARKET_15K";
        public string RuleName => "Market %10 İndirim Kampanyası";

        public (bool IsEligible, int PriorityScore, string Reason) Evaluate(CustomerSpendMetrics metrics)
        {
            metrics.CategorySpends.TryGetValue(CategoryEnum.Market, out decimal marketSpend);

            if (marketSpend >= 15000)
            {
                // Öncelik Skoru: Harcanan tutara göre dinamik artar
                int score = 100 + (int)(marketSpend / 1000);
                return (true, score, $"Son 3 ayda Market harcamanız {marketSpend:N2} TL (> 15.000 TL)");
            }

            return (false, 0, string.Empty);
        }
    }
}

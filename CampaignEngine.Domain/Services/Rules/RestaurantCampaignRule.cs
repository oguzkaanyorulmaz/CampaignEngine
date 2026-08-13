using CampaignEngine.Domain.Common.Enums;
using CampaignEngine.Domain.DomainObjects;
using CampaignEngine.Domain.Interfaces.Rules;

namespace CampaignEngine.Domain.Services.Rules
{
    public class RestaurantCampaignRule : ICampaignRule
    {
        public string RuleCode => "RESTAURANT_8K";
        public string RuleName => "Restoran / Yeme-İçme Kampanyası";

        public (bool IsEligible, int PriorityScore, string Reason) Evaluate(CustomerSpendMetrics metrics)
        {
            metrics.CategorySpends.TryGetValue(CategoryEnum.Restaurant, out decimal restaurantSpend);

            if (restaurantSpend >= 8000)
            {
                int score = 88 + (int)(restaurantSpend / 1000);
                return (true, score, $"Son 3 ayda Restoran harcamanız {restaurantSpend:N2} TL (> 8.000 TL)");
            }

            return (false, 0, string.Empty);
        }
    }
}

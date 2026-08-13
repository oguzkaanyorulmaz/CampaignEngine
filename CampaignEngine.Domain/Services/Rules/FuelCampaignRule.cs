using CampaignEngine.Domain.Common.Enums;
using CampaignEngine.Domain.DomainObjects;
using CampaignEngine.Domain.Interfaces.Rules;

namespace CampaignEngine.Domain.Services.Rules
{
    public class FuelCampaignRule : ICampaignRule
    {
        public string RuleCode => "FUEL_5K";
        public string RuleName => "Yakıt Kampanyası";

        public (bool IsEligible, int PriorityScore, string Reason) Evaluate(CustomerSpendMetrics metrics)
        {
            metrics.CategorySpends.TryGetValue(CategoryEnum.GasStation, out decimal fuelSpend);

            if (fuelSpend >= 5000)
            {
                int score = 90 + (int)(fuelSpend / 1000);
                return (true, score, $"Son 3 ayda Akaryakıt harcamanız {fuelSpend:N2} TL (> 5.000 TL)");
            }

            return (false, 0, string.Empty);
        }
    }
}

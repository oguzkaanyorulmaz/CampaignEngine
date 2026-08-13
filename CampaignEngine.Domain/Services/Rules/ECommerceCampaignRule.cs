using CampaignEngine.Domain.DomainObjects;
using CampaignEngine.Domain.Interfaces.Rules;

namespace CampaignEngine.Domain.Services.Rules
{
    public class ECommerceCampaignRule : ICampaignRule
    {
        public string RuleCode => "ONLINE_60";
        public string RuleName => "E-Ticaret Kampanyası";

        public (bool IsEligible, int PriorityScore, string Reason) Evaluate(CustomerSpendMetrics metrics)
        {
            if (metrics.OnlineSpendRatio >= 0.60)
            {
                int score = 85 + (int)(metrics.OnlineSpendRatio * 20);
                return (true, score, $"Harcamalarınızın %{metrics.OnlineSpendRatio * 100:F0}'i Online/E-Ticaret işlemlerinden oluşuyor (> %60)");
            }

            return (false, 0, string.Empty);
        }
    }
}

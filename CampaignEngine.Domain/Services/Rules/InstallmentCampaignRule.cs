using CampaignEngine.Domain.DomainObjects;
using CampaignEngine.Domain.Interfaces.Rules;

namespace CampaignEngine.Domain.Services.Rules
{
    public class InstallmentCampaignRule : ICampaignRule
    {
        public string RuleCode => "INSTALLMENT_40";
        public string RuleName => "Faizsiz Taksit Kampanyası";

        public (bool IsEligible, int PriorityScore, string Reason) Evaluate(CustomerSpendMetrics metrics)
        {
            if (metrics.InstallmentSpendRatio >= 0.40)
            {
                int score = 82 + (int)(metrics.InstallmentSpendRatio * 20);
                return (true, score, $"Harcamalarınızın %{metrics.InstallmentSpendRatio * 100:F0}'ı taksitli işlemlerden oluşuyor.");
            }

            return (false, 0, string.Empty);
        }
    }
}

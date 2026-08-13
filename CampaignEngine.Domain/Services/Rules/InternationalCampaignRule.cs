using CampaignEngine.Domain.DomainObjects;
using CampaignEngine.Domain.Interfaces.Rules;

namespace CampaignEngine.Domain.Services.Rules
{
    public class InternationalCampaignRule : ICampaignRule
    {
        public string RuleCode => "INT_MILES";
        public string RuleName => "Mil Kart / Yurt Dışı Kampanyası";

        public (bool IsEligible, int PriorityScore, string Reason) Evaluate(CustomerSpendMetrics metrics)
        {
            if (metrics.HasInternationalTransaction)
            {
                return (true, 95, "Son 3 ay içinde yurt dışı harcamanız tespit edildi.");
            }

            return (false, 0, string.Empty);
        }
    }
}

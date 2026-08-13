using System.Collections.Generic;
using System.Linq;
using CampaignEngine.Domain.DomainObjects;
using CampaignEngine.Domain.Interfaces.Rules;

namespace CampaignEngine.Domain.Services
{
    public class CampaignRecommendationResult
    {
        public string RuleCode { get; set; } = string.Empty;
        public string CampaignName { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public int PriorityScore { get; set; }
    }

    public class CampaignRecommendationEngine
    {
        private readonly IEnumerable<ICampaignRule> _rules;

        public CampaignRecommendationEngine(IEnumerable<ICampaignRule> rules)
        {
            _rules = rules;
        }

        /// <summary>
        /// Müşteri metriklerini tüm kurallarla değerlendirir ve en yüksek öncelikli kampanyayı döner
        /// </summary>
        public CampaignRecommendationResult? EvaluateTopRecommendation(CustomerSpendMetrics metrics)
        {
            var eligibleRecommendations = new List<CampaignRecommendationResult>();

            foreach (var rule in _rules)
            {
                var (isEligible, priorityScore, reason) = rule.Evaluate(metrics);
                if (isEligible)
                {
                    eligibleRecommendations.Add(new CampaignRecommendationResult
                    {
                        RuleCode = rule.RuleCode,
                        CampaignName = rule.RuleName,
                        Reason = reason,
                        PriorityScore = priorityScore
                    });
                }
            }

            // En yüksek öncelik skoruna sahip olan kampanyayı seçer (Priority & Multi-Rule Resolution)
            return eligibleRecommendations
                .OrderByDescending(r => r.PriorityScore)
                .FirstOrDefault();
        }
    }
}

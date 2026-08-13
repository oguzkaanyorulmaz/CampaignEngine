using CampaignEngine.Domain.DomainObjects;

namespace CampaignEngine.Domain.Interfaces.Rules
{
    public interface ICampaignRule
    {
        string RuleCode { get; }
        string RuleName { get; }
        
        /// <summary>
        /// Müşteri metriklerinin kurala uyup uymadığını ve öncelik skorunu değerlendirir
        /// </summary>
        (bool IsEligible, int PriorityScore, string Reason) Evaluate(CustomerSpendMetrics metrics);
    }
}

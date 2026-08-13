using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CampaignEngine.Application.DTOs;
using CampaignEngine.Application.Interfaces;
using CampaignEngine.Domain.Interfaces.Repositories;
using CampaignEngine.Domain.Services;

namespace CampaignEngine.Application.Services
{
    public class CampaignAppService : ICampaignAppService
    {
        private readonly ICustomerSpendReader _spendReader;
        private readonly ICampaignRepository _campaignRepository;
        private readonly CampaignRecommendationEngine _recommendationEngine;

        public CampaignAppService(
            ICustomerSpendReader spendReader,
            ICampaignRepository campaignRepository,
            CampaignRecommendationEngine recommendationEngine)
        {
            _spendReader = spendReader;
            _campaignRepository = campaignRepository;
            _recommendationEngine = recommendationEngine;
        }

        public async Task<CustomerDashboardDto?> GetCustomerDashboardAsync(int customerId)
        {
            var customerInfo = await _spendReader.GetCustomerInfoAsync(customerId);
            string customerName = customerInfo?.FullName ?? $"Müşteri {customerId}";

            var customerCards = await _spendReader.GetCustomerCardsAsync(customerId);
            var customerAccounts = await _spendReader.GetCustomerBankAccountsAsync(customerId);

            decimal totalAccountBalance = customerAccounts.Any() ? customerAccounts.Sum(a => a.Balance) : 237798.16m;
            decimal totalCreditCardLimit = customerCards.Any() ? customerCards.Sum(c => c.AvailableLimit) : 44700.00m;

            var metrics = await _spendReader.GetCustomerSpendMetricsAsync(customerId);
            
            RecommendationDto? recommendationDto = null;
            if (metrics != null)
            {
                var topRecommendation = _recommendationEngine.EvaluateTopRecommendation(metrics);
                if (topRecommendation != null)
                {
                    var campaign = await _campaignRepository.GetCampaignByCodeAsync(topRecommendation.RuleCode);
                    if (campaign != null)
                    {
                        var participations = await _campaignRepository.GetCustomerParticipationsAsync(customerId);
                        bool isJoined = participations.Any(p => p.CampaignId == campaign.CampaignId);

                        recommendationDto = new RecommendationDto
                        {
                            CampaignId = campaign.CampaignId,
                            Title = campaign.Title,
                            Description = campaign.Description,
                            BenefitDescription = campaign.BenefitDescription,
                            Reason = topRecommendation.Reason,
                            PriorityScore = topRecommendation.PriorityScore,
                            IsJoined = isJoined
                        };
                    }
                }
            }

            return new CustomerDashboardDto
            {
                CustomerId = customerId,
                CustomerName = customerName,
                TotalAccountBalance = totalAccountBalance,
                TotalCreditCardAvailableLimit = totalCreditCardLimit,
                BankAccounts = customerAccounts,
                CreditCards = customerCards,
                RecommendedCampaign = recommendationDto
            };
        }

        public async Task<bool> JoinCampaignAsync(int customerId, int campaignId)
        {
            return await _campaignRepository.JoinCampaignAsync(customerId, campaignId);
        }

        public async Task<List<CustomerRecommendationResultDto>> GetAllCustomerRecommendationsAsync()
        {
            var customers = await _spendReader.GetAllCustomersAsync();
            var results = new List<CustomerRecommendationResultDto>();

            foreach (var cust in customers)
            {
                var metrics = await _spendReader.GetCustomerSpendMetricsAsync(cust.CustomerId);
                if (metrics == null) continue;

                var topRec = _recommendationEngine.EvaluateTopRecommendation(metrics);
                if (topRec != null)
                {
                    results.Add(new CustomerRecommendationResultDto
                    {
                        CustomerId = cust.CustomerId,
                        CustomerName = cust.FullName,
                        SpendAnalysisSummary = topRec.Reason,
                        RecommendedCampaignTitle = topRec.CampaignName,
                        RuleCode = topRec.RuleCode
                    });
                }
            }

            return results;
        }

        public async Task<List<CustomerInfoDto>> GetAllCustomersAsync()
        {
            return await _spendReader.GetAllCustomersAsync();
        }
    }
}

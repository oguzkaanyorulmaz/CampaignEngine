using System.Collections.Generic;
using System.Threading.Tasks;
using CampaignEngine.Application.DTOs;

namespace CampaignEngine.Application.Interfaces
{
    public interface ICampaignAppService
    {
        Task<CustomerDashboardDto?> GetCustomerDashboardAsync(int customerId);
        Task<bool> JoinCampaignAsync(int customerId, int campaignId);
        Task<List<CustomerRecommendationResultDto>> GetAllCustomerRecommendationsAsync();
        Task<List<CustomerInfoDto>> GetAllCustomersAsync();
    }

    public class CustomerRecommendationResultDto
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string SpendAnalysisSummary { get; set; } = string.Empty;
        public string RecommendedCampaignTitle { get; set; } = string.Empty;
        public string RuleCode { get; set; } = string.Empty;
    }
}

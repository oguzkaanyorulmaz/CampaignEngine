using System.Collections.Generic;
using System.Threading.Tasks;
using CampaignEngine.Application.DTOs;
using CampaignEngine.Domain.DomainObjects;

namespace CampaignEngine.Application.Interfaces
{
    public interface ICustomerSpendReader
    {
        Task<CustomerSpendMetrics?> GetCustomerSpendMetricsAsync(int customerId);
        Task<List<CreditCardDto>> GetCustomerCardsAsync(int customerId);
        Task<List<BankAccountDto>> GetCustomerBankAccountsAsync(int customerId);
        Task<List<int>> GetAllCustomerIdsAsync();
        Task<CustomerInfoDto?> GetCustomerInfoAsync(int customerId);
        Task<List<CustomerInfoDto>> GetAllCustomersAsync();
        Task<CustomerAuthResponseDto> AuthenticateCustomerAsync(string identityNumber, string password);
    }
}

using System.Threading.Tasks;
using CampaignEngine.Application.DTOs;
using CampaignEngine.Application.Interfaces;

namespace CampaignEngine.Application.Services
{
    public class AuthAppService : IAuthAppService
    {
        private readonly ICustomerSpendReader _spendReader;

        public AuthAppService(ICustomerSpendReader spendReader)
        {
            _spendReader = spendReader;
        }

        public async Task<CustomerAuthResponseDto> LoginAsync(CustomerLoginRequestDto request)
        {
            return await _spendReader.AuthenticateCustomerAsync(request.IdentityNumber, request.Password);
        }
    }
}

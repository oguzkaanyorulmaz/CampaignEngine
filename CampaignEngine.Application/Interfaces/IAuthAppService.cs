using System.Threading.Tasks;
using CampaignEngine.Application.DTOs;

namespace CampaignEngine.Application.Interfaces
{
    public interface IAuthAppService
    {
        Task<CustomerAuthResponseDto> LoginAsync(CustomerLoginRequestDto request);
    }
}

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using CampaignEngine.Application.Interfaces;

namespace CampaignEngine.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ICampaignAppService _campaignAppService;

        public DashboardController(ICampaignAppService campaignAppService)
        {
            _campaignAppService = campaignAppService;
        }

        /// <summary>
        /// Sistemdeki tüm gerçek müşterilerin listesini getirir
        /// </summary>
        [HttpGet("customers")]
        public async Task<IActionResult> GetCustomers()
        {
            var customers = await _campaignAppService.GetAllCustomersAsync();
            return Ok(customers);
        }

        /// <summary>
        /// Müşteri ID'sine göre bankacılık paneli verilerini, harcama geçmişini ve kişiselleştirilmiş kampanya önerisini getirir
        /// </summary>
        [HttpGet("{customerId}")]
        public async Task<IActionResult> GetCustomerDashboard(int customerId)
        {
            var dashboard = await _campaignAppService.GetCustomerDashboardAsync(customerId);
            if (dashboard == null)
            {
                return NotFound(new { message = $"Müşteri ID {customerId} bulunamadı veya işlem geçmişi yok." });
            }

            return Ok(dashboard);
        }
    }
}

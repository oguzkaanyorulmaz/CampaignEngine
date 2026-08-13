using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using CampaignEngine.Application.Interfaces;

namespace CampaignEngine.API.Controllers
{
    public class JoinCampaignRequest
    {
        public int CustomerId { get; set; }
        public int CampaignId { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class CampaignsController : ControllerBase
    {
        private readonly ICampaignAppService _campaignAppService;

        public CampaignsController(ICampaignAppService campaignAppService)
        {
            _campaignAppService = campaignAppService;
        }

        /// <summary>
        /// Önerilen kampanyaya müşteri katılımını kaydeder
        /// </summary>
        [HttpPost("join")]
        public async Task<IActionResult> JoinCampaign([FromBody] JoinCampaignRequest request)
        {
            var result = await _campaignAppService.JoinCampaignAsync(request.CustomerId, request.CampaignId);
            if (result)
            {
                return Ok(new { success = true, message = "Kampanyaya başarıyla katıldınız!" });
            }

            return BadRequest(new { success = false, message = "Kampanyaya katılım sağlanamadı." });
        }

        /// <summary>
        /// Admin paneli için tüm müşterilerin harcama analizi ve önerilen kampanya sonuç tablosunu getirir
        /// </summary>
        [HttpGet("admin/results")]
        public async Task<IActionResult> GetAdminResults()
        {
            var results = await _campaignAppService.GetAllCustomerRecommendationsAsync();
            return Ok(results);
        }
    }
}

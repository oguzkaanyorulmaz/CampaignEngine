using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using CampaignEngine.Application.DTOs;
using CampaignEngine.Application.Interfaces;

namespace CampaignEngine.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthAppService _authAppService;

        public AuthController(IAuthAppService authAppService)
        {
            _authAppService = authAppService;
        }

        /// <summary>
        /// Müşteri T.C. Kimlik Numarası ve 6 haneli şifresi ile güvenli giriş
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] CustomerLoginRequestDto request)
        {
            var result = await _authAppService.LoginAsync(request);
            return Ok(result);
        }
    }
}

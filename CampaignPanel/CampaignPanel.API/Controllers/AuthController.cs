using CampaignPanel.Application.DTOs;
using CampaignPanel.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CampaignPanel.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthAdminService _authService;

        public AuthController(IAuthAdminService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AdminLoginResultDto>> Login([FromBody] AdminLoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            if (!result.Success)
                return Unauthorized(result);
            return Ok(result);
        }
    }
}

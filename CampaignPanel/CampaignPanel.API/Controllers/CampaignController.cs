using CampaignPanel.Application.DTOs;
using CampaignPanel.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CampaignPanel.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CampaignController : ControllerBase
    {
        private readonly ICampaignAdminService _service;

        public CampaignController(ICampaignAdminService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<CampaignDto>>> GetAll()
        {
            var campaigns = await _service.GetAllCampaignsAsync();
            return Ok(campaigns);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CampaignDto>> GetById(int id)
        {
            var campaign = await _service.GetCampaignByIdAsync(id);
            if (campaign == null) return NotFound();
            return Ok(campaign);
        }

        [HttpPost]
        public async Task<ActionResult<CampaignDto>> Create([FromBody] CreateCampaignDto dto)
        {
            var created = await _service.CreateCampaignAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.CampaignId }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CampaignDto>> Update(int id, [FromBody] UpdateCampaignDto dto)
        {
            dto.CampaignId = id;
            var updated = await _service.UpdateCampaignAsync(dto);
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _service.DeleteCampaignAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpGet("stats")]
        public async Task<ActionResult<DashboardStatsDto>> GetStats()
        {
            var stats = await _service.GetDashboardStatsAsync();
            return Ok(stats);
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Scheduling.Application.DTOs.Availability;
using Scheduling.Application.Services;

namespace Scheduling.Presentation.Controllers
{
    [ApiController]
    [Route("api/availability")]
    
    public class AvailabilityController : ControllerBase
    {
        private readonly AvailabilityService _availabilityService;

        public AvailabilityController(AvailabilityService availabilityService)
        {
            _availabilityService = availabilityService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateAvailabilityRequest request)
        {
            var response = await _availabilityService.CreateSlotAsync(request);
            return CreatedAtAction(nameof(GetMySlots), new { id = response.Id }, response);
        }

        [HttpGet]
        public async Task<IActionResult> GetMySlots()
        {
            var response = await _availabilityService.GetMySlotsAsync();
            return Ok(response);
        }

        [HttpGet("provider/{providerId:guid}")]
        [ProducesResponseType(typeof(IEnumerable<AvailabilityResponse>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProviderAvailability(Guid providerId)
        {
            var availability = await _availabilityService.GetProviderAvailabilityAsync(providerId);

            return Ok(availability);
        }
    }
}

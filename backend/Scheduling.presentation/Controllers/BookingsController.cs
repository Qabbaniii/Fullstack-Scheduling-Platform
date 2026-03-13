using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Scheduling.Application.DTOs.Bookings;
using Scheduling.Application.Services;

namespace Scheduling.Presentation.Controllers
{
    [ApiController]
    [Route("api/bookings")]
    public class BookingsController : ControllerBase
    {
        private readonly BookingService _bookingService;

        public BookingsController(BookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBookingRequest request)
        {
            var result = await _bookingService.CreateBookingAsync(request);
            return Created(string.Empty, result);
        }

        [HttpGet("MyBookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            var result = await _bookingService.GetMyBookingsAsync();
            return Ok(result);
        }

        [HttpPut("cancel/{id:guid}")]

        public async Task<IActionResult> Cancel(Guid id)
        {
            var result = await _bookingService.CancelBookingAsync(id);
            return Ok(result);
        }


        [HttpGet("provider/{providerId:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProviderBookingsByDate(Guid providerId, [FromQuery] DateTime date)
        {
            var result = await _bookingService.GetProviderBookingsByDateAsync(providerId, date);
            return Ok(result);
        }
    }
}

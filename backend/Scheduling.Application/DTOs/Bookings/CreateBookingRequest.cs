using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Application.DTOs.Bookings
{
    public class CreateBookingRequest
    {
        public Guid ServiceId { get; set; }
        public DateTime StartTime { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Domain.Exceptions
{
    public sealed class BookingOutsideAvailabilityException : Exception
    {
        public BookingOutsideAvailabilityException(string message = "The selected time is outside provider availability.") : base(message) { }
    }
}

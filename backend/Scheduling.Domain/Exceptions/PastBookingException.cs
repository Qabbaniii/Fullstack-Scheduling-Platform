using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Domain.Exceptions
{
    public sealed class PastBookingException : Exception
    {
        public PastBookingException(string message = "Bookings must be created for a future UTC time.") : base(message) { }
    }
}

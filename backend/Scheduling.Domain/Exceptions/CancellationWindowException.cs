using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Domain.Exceptions
{
    public sealed class CancellationWindowException : Exception
    {
        public CancellationWindowException(string message = "Bookings cannot be cancelled within one hour of the start time.") : base(message) { }
    }
}

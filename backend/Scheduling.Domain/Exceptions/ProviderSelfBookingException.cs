using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Domain.Exceptions
{
    public sealed class ProviderSelfBookingException : Exception
    {
        public ProviderSelfBookingException(string message = "Providers cannot book their own services.") : base(message) { }
    }
}

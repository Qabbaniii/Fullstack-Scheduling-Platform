using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Domain.Exceptions
{
    public class CustomerAlreadyHasBookingException : Exception
    {
        public CustomerAlreadyHasBookingException(string message = "This customer already has an active booking.")
            : base(message)
        {
        }
    }
}

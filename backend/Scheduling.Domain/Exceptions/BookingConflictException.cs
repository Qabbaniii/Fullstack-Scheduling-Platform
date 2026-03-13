using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Domain.Exceptions
{
    public sealed class BookingConflictException : Exception
    {
        public BookingConflictException(string message = "A booking already exists for this time slot.") : base(message) { }
    }
}

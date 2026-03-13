using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Domain.Exceptions
{
    public sealed class UnauthorizedDomainException : Exception
    {
        public UnauthorizedDomainException(string message = "You are not authorized to perform this action.") : base(message) { }
    }
}

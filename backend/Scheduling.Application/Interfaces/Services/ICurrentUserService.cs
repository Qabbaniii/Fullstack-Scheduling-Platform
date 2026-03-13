using Scheduling.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Application.Interfaces.Services
{
    public interface ICurrentUserService
    {
        Guid UserId { get; }
        UserRole Role { get; }
    }
}

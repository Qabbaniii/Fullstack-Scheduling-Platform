using Scheduling.Application.DTOs.Auth;
using Scheduling.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Application.Interfaces.Services
{
    public interface ITokenService
    {
        AuthResponse GenerateToken(User user);
    }
}

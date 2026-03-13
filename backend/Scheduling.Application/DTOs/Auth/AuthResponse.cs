using Scheduling.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Application.DTOs.Auth
{
    public class AuthResponse
    {
        public string Token { get; set; } = default!;
        public Guid UserId { get; set; }
        public string FullName { get; set; } = default!;
        public string Role { get; set; } = default!;
    }
}

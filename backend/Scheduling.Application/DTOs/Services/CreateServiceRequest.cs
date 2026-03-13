using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Application.DTOs.Services
{
    public class CreateServiceRequest
    {
        public string Name { get; set; } = default!;
        public string Description { get; set; } = default!;
        public int DurationMinutes { get; set; }
        public decimal Price { get; set; }
    }
}

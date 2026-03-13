using Scheduling.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Application.Interfaces.Repositories
{
    public interface IAvailabilityRepository
    {
        Task AddAsync(AvailabilitySlot slot);
        Task<List<AvailabilitySlot>> GetByProviderIdAsync(Guid providerId);
        Task<bool> IsWithinAvailabilityAsync(Guid providerId, DateTime startTimeUtc, DateTime endTimeUtc);
        Task<bool> HasOverlapAsync(Guid providerId, DateTime startTimeUtc, DateTime endTimeUtc);
    }
}

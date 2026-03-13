using Microsoft.EntityFrameworkCore;
using Scheduling.Application.Interfaces.Repositories;
using Scheduling.Domain.Entities;
using Scheduling.Infrastructure.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Infrastructure.Repositories
{
    public class AvailabilityRepository : IAvailabilityRepository
    {
        private readonly AppDbContext _context;

        public AvailabilityRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(AvailabilitySlot slot)
        {
            await _context.AvailabilitySlots.AddAsync(slot);
        }

        public async Task<List<AvailabilitySlot>> GetByProviderIdAsync(Guid providerId)
        {
            return await _context.AvailabilitySlots
                .AsNoTracking()
                .Where(x => x.ProviderId == providerId)
                .OrderBy(x => x.StartTime)
                .ToListAsync();
        }

        public async Task<bool> IsWithinAvailabilityAsync(Guid providerId, DateTime startTimeUtc, DateTime endTimeUtc)
        {
            return await _context.AvailabilitySlots
                .AsNoTracking()
                .AnyAsync(x =>
                    x.ProviderId == providerId &&
                    x.StartTime <= startTimeUtc &&
                    x.EndTime >= endTimeUtc);
        }

        public async Task<bool> HasOverlapAsync(Guid providerId, DateTime startTimeUtc, DateTime endTimeUtc)
        {
            return await _context.AvailabilitySlots
                .AsNoTracking()
                .AnyAsync(x =>
                    x.ProviderId == providerId &&
                    x.StartTime < endTimeUtc &&
                    x.EndTime > startTimeUtc);
        }
    }
}

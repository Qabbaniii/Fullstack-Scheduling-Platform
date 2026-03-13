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
    public class ServiceRepository : IServiceRepository
    {
        private readonly AppDbContext _context;

        public ServiceRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Service service)
        {
            await _context.Services.AddAsync(service);
        }

        public async Task<Service?> GetByIdAsync(Guid id)
        {
            return await _context.Services
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Service?> GetByIdWithProviderAsync(Guid id)
        {
            return await _context.Services
                .Include(s => s.Provider)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<List<Service>> GetAllAsync(string? search)
        {
            IQueryable<Service> query = _context.Services
                .AsNoTracking()
                .Include(s => s.Provider);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var trimmedSearch = search.Trim();
                query = query.Where(s => s.Name.Contains(trimmedSearch));
            }

            return await query
                .OrderBy(s => s.Name)
                .ToListAsync();
        }
    }
}

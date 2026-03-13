using Scheduling.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Application.Interfaces.Repositories
{
    public interface IServiceRepository
    {
        Task AddAsync(Service service);
        Task<Service?> GetByIdAsync(Guid id);
        Task<Service?> GetByIdWithProviderAsync(Guid id);
        Task<List<Service>> GetAllAsync(string? search);
    }
}

using Scheduling.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Application.Interfaces.Repositories
{
    public interface IBookingRepository
    {
        Task AddAsync(Booking booking);
        Task<Booking?> GetByIdAsync(Guid id);
        Task<List<Booking>> GetByCustomerIdAsync(Guid customerId);
        Task<bool> CheckConflictWithLockAsync(Guid providerId, DateTime startTimeUtc, DateTime endTimeUtc);
        Task<bool> HasActiveBookingForServiceAsync(Guid customerId, Guid serviceId);
        Task<List<Booking>> GetProviderBookingsByDateAsync(Guid providerId, DateTime date);

    }
}

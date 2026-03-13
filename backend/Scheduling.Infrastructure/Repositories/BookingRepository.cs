using Microsoft.EntityFrameworkCore;
using Scheduling.Application.Interfaces.Repositories;
using Scheduling.Domain.Entities;
using Scheduling.Domain.Enums;
using Scheduling.Infrastructure.Contexts;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Infrastructure.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly AppDbContext _context;

        public BookingRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Booking booking)
        {
            await _context.Bookings.AddAsync(booking);
        }

        public async Task<Booking?> GetByIdAsync(Guid id)
        {
            return await _context.Bookings
                .Include(b => b.Service)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<List<Booking>> GetByCustomerIdAsync(Guid customerId)
        {
            return await _context.Bookings
                .AsNoTracking()
                .Include(b => b.Service)
                .Where(b => b.CustomerId == customerId)
                .OrderByDescending(b => b.StartTime)
                .ToListAsync();
        }

        public async Task<bool> CheckConflictWithLockAsync(Guid providerId, DateTime startTimeUtc, DateTime endTimeUtc)
        {
            await using var transaction =
                await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);

            var conflicts = await _context.Bookings
                .FromSqlInterpolated($@"
            SELECT *
            FROM Bookings WITH (UPDLOCK, ROWLOCK)
            WHERE ProviderId = {providerId}
              AND Status IN ({BookingStatus.Pending.ToString()}, {BookingStatus.Confirmed.ToString()})
              AND StartTime < {endTimeUtc}
              AND EndTime > {startTimeUtc}")
                .ToListAsync();

            await transaction.CommitAsync();

            return conflicts.Any();
        }

        public async Task<List<Booking>> GetProviderBookingsByDateAsync(Guid providerId, DateTime date)
        {
            var dayStart = date.Date;
            var dayEnd = dayStart.AddDays(1);

            return await _context.Bookings
                .AsNoTracking()
                .Include(b => b.Service)
                .Where(b =>
                    b.ProviderId == providerId &&
                    b.StartTime >= dayStart &&
                    b.StartTime < dayEnd)
                .OrderBy(b => b.StartTime)
                .ToListAsync();
        }

        public async Task<bool> HasActiveBookingForServiceAsync(Guid customerId, Guid serviceId)
        {
            return await _context.Bookings
                .AsNoTracking()
                .AnyAsync(b =>
                    b.CustomerId == customerId &&
                    b.ServiceId == serviceId &&
                    (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed));
        }
    }
}

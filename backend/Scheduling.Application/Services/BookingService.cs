using Microsoft.EntityFrameworkCore;
using Scheduling.Application.DTOs.Bookings;
using Scheduling.Application.Interfaces;
using Scheduling.Application.Interfaces.Repositories;
using Scheduling.Application.Interfaces.Services;
using Scheduling.Domain.Enums;
using Scheduling.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Application.Services
{
    public class BookingService
    {
        private readonly IServiceRepository _serviceRepository;
        private readonly IAvailabilityRepository _availabilityRepository;
        private readonly IBookingRepository _bookingRepository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IUnitOfWork _unitOfWork;

        public BookingService(
            IServiceRepository serviceRepository,
            IAvailabilityRepository availabilityRepository,
            IBookingRepository bookingRepository,
            ICurrentUserService currentUserService,
            IUnitOfWork unitOfWork)
        {
            _serviceRepository = serviceRepository;
            _availabilityRepository = availabilityRepository;
            _bookingRepository = bookingRepository;
            _currentUserService = currentUserService;
            _unitOfWork = unitOfWork;
        }

        public async Task<BookingResponse> CreateBookingAsync(CreateBookingRequest request)
        {
            if (_currentUserService.Role != UserRole.Customer)
            {
                throw new UnauthorizedDomainException("Only customers can create bookings.");
            }

            var customerId = _currentUserService.UserId;

            var hasActiveBookingForService = await _bookingRepository
                .HasActiveBookingForServiceAsync(customerId, request.ServiceId);

            if (hasActiveBookingForService)
            {
                throw new BookingConflictException("You already have an active booking for this service.");
            }

            var service = await _serviceRepository.GetByIdWithProviderAsync(request.ServiceId);
            if (service is null)
            {
                throw new NotFoundException("Service not found.");
            }

            var providerId = service.ProviderId;

            if (customerId == providerId)
            {
                throw new ProviderSelfBookingException("Providers cannot book their own services.");
            }

            var startTimeUtc = request.StartTime.Kind == DateTimeKind.Utc
                ? request.StartTime
                : request.StartTime.ToUniversalTime();

            var endTimeUtc = startTimeUtc.AddMinutes(service.DurationMinutes);

            if (startTimeUtc <= DateTime.UtcNow)
            {
                throw new PastBookingException("Booking time must be in the future.");
            }

            var hasAvailability = await _availabilityRepository.IsWithinAvailabilityAsync(
                providerId,
                startTimeUtc,
                endTimeUtc);

            if (!hasAvailability)
            {
                throw new BookingOutsideAvailabilityException("This time slot is not available.");
            }

            var hasConflict = await _bookingRepository.CheckConflictWithLockAsync(
                providerId,
                startTimeUtc,
                endTimeUtc);

            if (hasConflict)
            {
                throw new BookingConflictException("This time slot is already booked.");
            }

            var booking = Scheduling.Domain.Entities.Booking.Create(
                Guid.NewGuid(),
                customerId,
                service.Id,
                providerId,
                startTimeUtc,
                endTimeUtc,
                BookingStatus.Confirmed,
                DateTime.UtcNow);

            try
            {
                await _bookingRepository.AddAsync(booking);
                await _unitOfWork.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw new BookingConflictException("This slot was just booked by another user.");
            }

            return new BookingResponse
            {
                Id = booking.Id,
                ServiceId = booking.ServiceId,
                ServiceName = service.Name,
                ProviderId = booking.ProviderId,
                StartTime = booking.StartTime,
                EndTime = booking.EndTime,
                Status = booking.Status.ToString(),
                CreatedAt = booking.CreatedAt
            };
        }

        public async Task<List<BookingResponse>> GetMyBookingsAsync()
        {
            if (_currentUserService.Role != UserRole.Customer)
            {
                throw new UnauthorizedDomainException("Only customers can view their bookings.");
            }

            var customerId = _currentUserService.UserId;

            var bookings = await _bookingRepository.GetByCustomerIdAsync(customerId);

            return bookings.Select(b => new BookingResponse
            {
                Id = b.Id,
                ServiceId = b.ServiceId,
                ServiceName = b.Service.Name,
                ProviderId = b.ProviderId,
                StartTime = b.StartTime,
                EndTime = b.EndTime,
                Status = b.Status.ToString(),
                CreatedAt = b.CreatedAt
            }).ToList();
        }

        public async Task<BookingResponse> CancelBookingAsync(Guid bookingId)
        {
            var currentUserId = _currentUserService.UserId;

            var booking = await _bookingRepository.GetByIdAsync(bookingId);
            if (booking is null)
            {
                throw new NotFoundException("Booking not found.");
            }

            if (booking.CustomerId != currentUserId)
            {
                throw new UnauthorizedDomainException("You cannot cancel this booking.");
            }

            if (booking.StartTime - DateTime.UtcNow <= TimeSpan.FromHours(1))
            {
                throw new CancellationWindowException("Bookings cannot be cancelled within 1 hour.");
            }

            booking.Cancel();

            await _unitOfWork.SaveChangesAsync();

            return new BookingResponse
            {
                Id = booking.Id,
                ServiceId = booking.ServiceId,
                ServiceName = booking.Service.Name,
                ProviderId = booking.ProviderId,
                StartTime = booking.StartTime,
                EndTime = booking.EndTime,
                Status = booking.Status.ToString(),
                CreatedAt = booking.CreatedAt
            };
        }

        public async Task<List<BookingResponse>> GetProviderBookingsByDateAsync(Guid providerId, DateTime date)
        {
            var bookings = await _bookingRepository.GetProviderBookingsByDateAsync(providerId, date);

            return bookings.Select(b => new BookingResponse
            {
                Id = b.Id,
                ServiceId = b.ServiceId,
                ServiceName = b.Service.Name,
                ProviderId = b.ProviderId,
                StartTime = b.StartTime,
                EndTime = b.EndTime,
                Status = b.Status.ToString(),
                CreatedAt = b.CreatedAt
            }).ToList();
        }
    }
}

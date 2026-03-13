using Scheduling.Application.DTOs.Availability;
using Scheduling.Application.Interfaces;
using Scheduling.Application.Interfaces.Repositories;
using Scheduling.Application.Interfaces.Services;
using Scheduling.Domain.Entities;
using Scheduling.Domain.Enums;
using Scheduling.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Application.Services
{
    public class AvailabilityService
    {
        private readonly IAvailabilityRepository _availabilityRepository;
        private readonly IUserRepository _userRepository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IUnitOfWork _unitOfWork;

        public AvailabilityService(
            IAvailabilityRepository availabilityRepository,
            IUserRepository userRepository,
            ICurrentUserService currentUserService,
            IUnitOfWork unitOfWork)
        {
            _availabilityRepository = availabilityRepository;
            _userRepository = userRepository;
            _currentUserService = currentUserService;
            _unitOfWork = unitOfWork;
        }

        public async Task<AvailabilityResponse> CreateSlotAsync(CreateAvailabilityRequest request)
        {
            if (_currentUserService.Role != UserRole.Provider)
            {
                throw new UnauthorizedDomainException("Only providers can create availability slots.");
            }

            var provider = await _userRepository.GetByIdAsync(_currentUserService.UserId);
            if (provider is null)
            {
                throw new NotFoundException("Provider not found.");
            }

            var startTimeUtc = request.StartTime.Kind == DateTimeKind.Utc
                ? request.StartTime
                : request.StartTime.ToUniversalTime();

            var endTimeUtc = request.EndTime.Kind == DateTimeKind.Utc
                ? request.EndTime
                : request.EndTime.ToUniversalTime();

            var hasOverlap = await _availabilityRepository.HasOverlapAsync(
                provider.Id,
                startTimeUtc,
                endTimeUtc);

            if (hasOverlap)
            {
                throw new BookingConflictException("This availability slot overlaps with an existing slot.");
            }

            var slot = AvailabilitySlot.Create(
                Guid.NewGuid(),
                provider.Id,
                startTimeUtc,
                endTimeUtc);

            await _availabilityRepository.AddAsync(slot);
            await _unitOfWork.SaveChangesAsync();

            return new AvailabilityResponse
            {
                Id = slot.Id,
                ProviderId = slot.ProviderId,
                StartTime = slot.StartTime,
                EndTime = slot.EndTime
            };
        }

        public async Task<List<AvailabilityResponse>> GetMySlotsAsync()
        {
            if (_currentUserService.Role != UserRole.Provider)
            {
                throw new UnauthorizedDomainException("Only providers can view their availability slots.");
            }

            var slots = await _availabilityRepository.GetByProviderIdAsync(_currentUserService.UserId);

            return slots.Select(x => new AvailabilityResponse
            {
                Id = x.Id,
                ProviderId = x.ProviderId,
                StartTime = x.StartTime,
                EndTime = x.EndTime
            }).ToList();
        }

        public async Task<IEnumerable<AvailabilityResponse>> GetProviderAvailabilityAsync(Guid providerId)
        {
            var slots = await _availabilityRepository.GetByProviderIdAsync(providerId);

            return slots.Select(a => new AvailabilityResponse
            {
                Id = a.Id,
                ProviderId = a.ProviderId,
                StartTime = a.StartTime,
                EndTime = a.EndTime
            });
        }
    }
}

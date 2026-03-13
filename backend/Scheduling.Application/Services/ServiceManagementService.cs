using Scheduling.Application.DTOs.Services;
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
    public class ServiceManagementService
    {
        private readonly IServiceRepository _serviceRepository;
        private readonly IUserRepository _userRepository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IUnitOfWork _unitOfWork;

        public ServiceManagementService(
            IServiceRepository serviceRepository,
            IUserRepository userRepository,
            ICurrentUserService currentUserService,
            IUnitOfWork unitOfWork)
        {
            _serviceRepository = serviceRepository;
            _userRepository = userRepository;
            _currentUserService = currentUserService;
            _unitOfWork = unitOfWork;
        }

        public async Task<ServiceResponse> CreateAsync(CreateServiceRequest request)
        {
            if (_currentUserService.Role != UserRole.Provider)
            {
                throw new UnauthorizedDomainException("Only providers can create services.");
            }

            var provider = await _userRepository.GetByIdAsync(_currentUserService.UserId);
            if (provider is null)
            {
                throw new NotFoundException("Provider not found.");
            }

            var service = Service.Create(
                Guid.NewGuid(),
                request.Name,
                request.Description,
                request.DurationMinutes,
                request.Price,
                provider.Id);

            await _serviceRepository.AddAsync(service);
            await _unitOfWork.SaveChangesAsync();

            return new ServiceResponse
            {
                Id = service.Id,
                Name = service.Name,
                Description = service.Description,
                DurationMinutes = service.DurationMinutes,
                Price = service.Price,
                ProviderId = provider.Id,
                ProviderName = provider.FullName
            };
        }

        public async Task<List<ServiceResponse>> GetAllAsync(string? search)
        {
            var services = await _serviceRepository.GetAllAsync(search);

            return services.Select(s => new ServiceResponse
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                DurationMinutes = s.DurationMinutes,
                Price = s.Price,
                ProviderId = s.ProviderId,
                ProviderName = s.Provider.FullName
            }).ToList();
        }

        public async Task<ServiceResponse> GetByIdAsync(Guid id)
        {
            var service = await _serviceRepository.GetByIdWithProviderAsync(id);
            if (service is null)
            {
                throw new NotFoundException("Service not found.");
            }

            return new ServiceResponse
            {
                Id = service.Id,
                Name = service.Name,
                Description = service.Description,
                DurationMinutes = service.DurationMinutes,
                Price = service.Price,
                ProviderId = service.ProviderId,
                ProviderName = service.Provider.FullName
            };
        }
    }
}

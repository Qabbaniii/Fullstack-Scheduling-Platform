using Scheduling.Application.DTOs.Auth;
using Scheduling.Application.Interfaces;
using Scheduling.Application.Interfaces.Repositories;
using Scheduling.Application.Interfaces.Services;
using Scheduling.Domain.Entities;
using Scheduling.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Application.Services
{
    public class AuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly ITokenService _tokenService;
        private readonly IUnitOfWork _unitOfWork;

        public AuthService(
            IUserRepository userRepository,
            IPasswordHasher passwordHasher,
            ITokenService tokenService,
            IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _tokenService = tokenService;
            _unitOfWork = unitOfWork;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            var normalizedEmail = request.Email.Trim().ToLowerInvariant();

            var exists = await _userRepository.EmailExistsAsync(normalizedEmail);
            if (exists)
            {
                throw new UnauthorizedDomainException("A user with this email already exists.");
            }

            var passwordHash = _passwordHasher.Hash(request.Password);

            var user = User.Create(
                Guid.NewGuid(),
                request.FullName,
                normalizedEmail,
                passwordHash,
                request.Role,
                DateTime.UtcNow);

            await _userRepository.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return _tokenService.GenerateToken(user);
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var normalizedEmail = request.Email.Trim().ToLowerInvariant();

            var user = await _userRepository.GetByEmailAsync(normalizedEmail);
            if (user is null)
            {
                throw new UnauthorizedDomainException("Invalid email or password.");
            }

            var isValidPassword = _passwordHasher.Verify(request.Password, user.PasswordHash);
            if (!isValidPassword)
            {
                throw new UnauthorizedDomainException("Invalid email or password.");
            }

            return _tokenService.GenerateToken(user);
        }
    }
}

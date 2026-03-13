using Scheduling.Application.Interfaces.Services;
using Scheduling.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Scheduling.Infrastructure.AuthServices
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Guid UserId
        {
            get
            {
                var httpContext = _httpContextAccessor.HttpContext;
                if (httpContext?.User?.Identity?.IsAuthenticated != true)
                {
                    throw new InvalidOperationException("No authenticated user found.");
                }

                var userIdValue =
                    httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                    httpContext.User.FindFirst("sub")?.Value;

                if (string.IsNullOrWhiteSpace(userIdValue))
                {
                    throw new InvalidOperationException("Authenticated user id is not available.");
                }

                if (!Guid.TryParse(userIdValue, out var userId))
                {
                    throw new InvalidOperationException("Authenticated user id is invalid.");
                }

                return userId;
            }
        }

        public UserRole Role
        {
            get
            {
                var httpContext = _httpContextAccessor.HttpContext;
                if (httpContext?.User?.Identity?.IsAuthenticated != true)
                {
                    throw new InvalidOperationException("No authenticated user found.");
                }

                var roleValue =
                    httpContext.User.FindFirst(ClaimTypes.Role)?.Value ??
                    httpContext.User.FindFirst("role")?.Value;

                if (string.IsNullOrWhiteSpace(roleValue))
                {
                    throw new InvalidOperationException("Authenticated user role is not available.");
                }

                if (!Enum.TryParse<UserRole>(roleValue, true, out var role))
                {
                    throw new InvalidOperationException($"Authenticated user role '{roleValue}' is invalid.");
                }

                return role;
            }
        }
    }
}

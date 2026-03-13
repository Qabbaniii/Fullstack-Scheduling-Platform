using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Scheduling.Domain.Exceptions;
using System.Text.Json;

namespace Scheduling.Presentation.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {
                await HandleExceptionAsync(context, exception);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var (statusCode, title, detail) = exception switch
            {
                NotFoundException ex => (
                    StatusCodes.Status404NotFound,
                    "Not Found",
                    ex.Message),

                BookingConflictException ex => (
                    StatusCodes.Status409Conflict,
                    "Booking Conflict",
                    ex.Message),

                BookingOutsideAvailabilityException ex => (
                    StatusCodes.Status400BadRequest,
                    "Booking Outside Availability",
                    ex.Message),

                CustomerAlreadyHasBookingException ex => (
                    StatusCodes.Status400BadRequest,
                    "Customer Already Has Booking",
                    ex.Message),

                PastBookingException ex => (
                    StatusCodes.Status400BadRequest,
                    "Past Booking",
                    ex.Message),

                CancellationWindowException ex => (
                    StatusCodes.Status400BadRequest,
                    "Cancellation Window Violation",
                    ex.Message),

                ProviderSelfBookingException ex => (
                    StatusCodes.Status403Forbidden,
                    "Provider Self Booking Forbidden",
                    ex.Message),

                UnauthorizedDomainException ex => (
                    StatusCodes.Status403Forbidden,
                    "Forbidden",
                    ex.Message),

                ValidationException ex => (
                    StatusCodes.Status400BadRequest,
                    "Validation Error",
                    string.Join(" | ", ex.Errors.Select(e => e.ErrorMessage))),

                Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException => (
                    StatusCodes.Status409Conflict,
                    "Concurrency Conflict",
                    "This record was modified by another request."),

                _ => (
                    StatusCodes.Status500InternalServerError,
                    "Internal Server Error",
                    exception.Message)
            };

            context.Response.ContentType = "application/problem+json";
            context.Response.StatusCode = statusCode;

            var problemDetails = new ProblemDetails
            {
                Type = "https://tools.ietf.org/html/rfc7807",
                Title = title,
                Status = statusCode,
                Detail = detail,
                Instance = context.Request.Path
            };

            problemDetails.Extensions["traceId"] = context.TraceIdentifier;

            var json = JsonSerializer.Serialize(problemDetails);

            await context.Response.WriteAsync(json);
        }
    }
}

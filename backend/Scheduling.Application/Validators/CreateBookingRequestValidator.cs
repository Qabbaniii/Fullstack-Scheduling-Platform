using FluentValidation;
using Scheduling.Application.DTOs.Bookings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Application.Validators
{
    public class CreateBookingRequestValidator : AbstractValidator<CreateBookingRequest>
    {
        public CreateBookingRequestValidator()
        {
            RuleFor(x => x.ServiceId)
                .NotEmpty();

            RuleFor(x => x.StartTime)
                .NotEmpty()
                .Must(x => x.Kind == DateTimeKind.Utc || x.ToUniversalTime() > DateTime.UtcNow)
                .WithMessage("StartTime must be in the future.");

            RuleFor(x => x)
                .Must(x => x.StartTime.ToUniversalTime() > DateTime.UtcNow)
                .WithMessage("StartTime must be in the future.");
        }
    }
}

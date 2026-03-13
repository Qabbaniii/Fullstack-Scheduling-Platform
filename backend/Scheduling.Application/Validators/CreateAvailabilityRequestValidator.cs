using FluentValidation;
using Scheduling.Application.DTOs.Availability;
using Scheduling.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Application.Validators
{
    public class CreateAvailabilityRequestValidator : AbstractValidator<CreateAvailabilityRequest>
    {
        public CreateAvailabilityRequestValidator()
        {
            RuleFor(x => x.StartTime)
                .NotEmpty();

            RuleFor(x => x.EndTime)
                .NotEmpty();

            RuleFor(x => x)
                .Must(x => x.StartTime < x.EndTime)
                .WithMessage("StartTime must be before EndTime.");

            RuleFor(x => x)
                .Must(x => (x.EndTime - x.StartTime).TotalMinutes >= 30)
                .WithMessage("Availability slot must be at least 30 minutes.");
        }
    }
}

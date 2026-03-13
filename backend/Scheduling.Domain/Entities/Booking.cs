using Scheduling.Domain.Common;
using Scheduling.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Domain.Entities
{
    public class Booking : BaseEntity
    {
        public Guid CustomerId { get; private set; }
        public Guid ServiceId { get; private set; }
        public Guid ProviderId { get; private set; }

        public DateTime StartTime { get; private set; }
        public DateTime EndTime { get; private set; }
        public BookingStatus Status { get; private set; }
        public DateTime CreatedAt { get; private set; }

        public User Customer { get; private set; } = default!;
        public Service Service { get; private set; } = default!;

        [Timestamp]
        public byte[] RowVersion { get; private set; } = default!;

        private Booking()
        {
        }

        private Booking(
            Guid id,
            Guid customerId,
            Guid serviceId,
            Guid providerId,
            DateTime startTimeUtc,
            DateTime endTimeUtc,
            BookingStatus status,
            DateTime createdAtUtc) : base(id)
        {
            CustomerId = customerId;
            ServiceId = serviceId;
            ProviderId = providerId;
            StartTime = DateTime.SpecifyKind(startTimeUtc, DateTimeKind.Utc);
            EndTime = DateTime.SpecifyKind(endTimeUtc, DateTimeKind.Utc);
            Status = status;
            CreatedAt = DateTime.SpecifyKind(createdAtUtc, DateTimeKind.Utc);
        }

        public static Booking Create(
            Guid id,
            Guid customerId,
            Guid serviceId,
            Guid providerId,
            DateTime startTimeUtc,
            DateTime endTimeUtc,
            BookingStatus status,
            DateTime createdAtUtc)
        {
            return new Booking(
                id,
                customerId,
                serviceId,
                providerId,
                startTimeUtc,
                endTimeUtc,
                status,
                createdAtUtc);
        }

        public void Cancel()
        {
            Status = BookingStatus.Cancelled;
        }
    }
}

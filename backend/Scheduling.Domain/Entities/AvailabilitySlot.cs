using Scheduling.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Domain.Entities
{
    public class AvailabilitySlot : BaseEntity
    {
        public Guid ProviderId { get; private set; }
        public DateTime StartTime { get; private set; }
        public DateTime EndTime { get; private set; }

        public User Provider { get; private set; } = default!;

        private AvailabilitySlot()
        {
        }

        private AvailabilitySlot(
            Guid id,
            Guid providerId,
            DateTime startTimeUtc,
            DateTime endTimeUtc) : base(id)
        {
            ProviderId = providerId;
            StartTime = DateTime.SpecifyKind(startTimeUtc, DateTimeKind.Utc);
            EndTime = DateTime.SpecifyKind(endTimeUtc, DateTimeKind.Utc);
        }

        public static AvailabilitySlot Create(
            Guid id,
            Guid providerId,
            DateTime startTimeUtc,
            DateTime endTimeUtc)
        {
            return new AvailabilitySlot(id, providerId, startTimeUtc, endTimeUtc);
        }
    }
}

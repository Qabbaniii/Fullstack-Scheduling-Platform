using Scheduling.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Domain.Entities
{
    public class Service : BaseEntity
    {
        public string Name { get; private set; } = default!;
        public string Description { get; private set; } = default!;
        public int DurationMinutes { get; private set; }
        public decimal Price { get; private set; }

        public Guid ProviderId { get; private set; }
        public User Provider { get; private set; } = default!;

        public ICollection<Booking> Bookings { get; private set; } = new List<Booking>();

        private Service()
        {
        }

        private Service(
            Guid id,
            string name,
            string description,
            int durationMinutes,
            decimal price,
            Guid providerId) : base(id)
        {
            Name = name;
            Description = description;
            DurationMinutes = durationMinutes;
            Price = price;
            ProviderId = providerId;
        }

        public static Service Create(
            Guid id,
            string name,
            string description,
            int durationMinutes,
            decimal price,
            Guid providerId)
        {
            return new Service(id, name, description, durationMinutes, price, providerId);
        }
    }
}

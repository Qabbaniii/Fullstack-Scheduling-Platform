using Scheduling.Domain.Common;
using Scheduling.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduling.Domain.Entities
{
    public class User : BaseEntity
    {
        public string FullName { get; private set; } = default!;
        public string Email { get; private set; } = default!;
        public string PasswordHash { get; private set; } = default!;
        public UserRole Role { get; private set; }
        public DateTime CreatedAt { get; private set; }

        public ICollection<Service> Services { get; private set; } = new List<Service>();
        public ICollection<Booking> Bookings { get; private set; } = new List<Booking>();
        public ICollection<AvailabilitySlot> AvailabilitySlots { get; private set; } = new List<AvailabilitySlot>();

        private User()
        {
        }

        private User(
            Guid id,
            string fullName,
            string email,
            string passwordHash,
            UserRole role,
            DateTime createdAtUtc) : base(id)
        {
            FullName = fullName;
            Email = email;
            PasswordHash = passwordHash;
            Role = role;
            CreatedAt = DateTime.SpecifyKind(createdAtUtc, DateTimeKind.Utc);
        }

        public static User Create(
            Guid id,
            string fullName,
            string email,
            string passwordHash,
            UserRole role,
            DateTime createdAtUtc)
        {
            return new User(id, fullName.Trim(), email.Trim().ToLowerInvariant(), passwordHash, role, createdAtUtc);
        }

        public void UpdateProfile(string fullName)
        {
            FullName = fullName.Trim();
        }
    }
}

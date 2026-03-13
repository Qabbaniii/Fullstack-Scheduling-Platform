export function toUtcDateInputValue(date) {
  const d = new Date(date);

  const year = d.getUTCFullYear();
  const month = `${d.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${d.getUTCDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatTimeLabel(date) {
  const d = new Date(date);

  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
}

export function addMinutes(date, minutes) {
  return new Date(new Date(date).getTime() + minutes * 60000);
}

export function generateTimeSlotsForDay(dateString, intervalMinutes) {
  const slots = [];

  const start = new Date(`${dateString}T00:00:00Z`);
  const end = new Date(`${dateString}T23:59:59Z`);

  let current = new Date(start);

  while (current <= end) {
    slots.push(new Date(current));
    current = addMinutes(current, intervalMinutes);
  }

  return slots;
}

export function isSlotInsideAvailability(
  slotStart,
  durationMinutes,
  availability,
) {
  const slotEnd = addMinutes(slotStart, durationMinutes);

  return availability.some((window) => {
    const windowStart = new Date(window.startTime);
    const windowEnd = new Date(window.endTime);

    return slotStart >= windowStart && slotEnd <= windowEnd;
  });
}

export function getAvailableDays(availability) {
  const unique = new Set(
    availability.map((a) => {
      const d = new Date(a.startTime);

      const year = d.getUTCFullYear();
      const month = `${d.getUTCMonth() + 1}`.padStart(2, "0");
      const day = `${d.getUTCDate()}`.padStart(2, "0");

      return `${year}-${month}-${day}`;
    }),
  );

  return Array.from(unique).sort();
}

export function getAvailableDays(availability = []) {
  const days = new Set();

  for (const slot of availability) {
    if (!slot?.startTime || !slot?.endTime) continue;

    const start = new Date(slot.startTime);
    const end = new Date(slot.endTime);

    const current = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
    );

    const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    while (current <= last) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, "0");
      const day = String(current.getDate()).padStart(2, "0");

      days.add(`${year}-${month}-${day}`);
      current.setDate(current.getDate() + 1);
    }
  }

  return Array.from(days).sort();
}

export function generateTimeSlotsForDay(selectedDate, durationMinutes) {
  if (!selectedDate || !durationMinutes) return [];

  const slots = [];
  const startOfDay = new Date(`${selectedDate}T00:00:00`);
  const endOfDay = new Date(`${selectedDate}T23:59:59`);
  const current = new Date(startOfDay);

  while (current <= endOfDay) {
    slots.push(new Date(current));
    current.setMinutes(current.getMinutes() + durationMinutes);
  }

  return slots;
}

export function isSlotInsideAvailability(
  slotStart,
  durationMinutes,
  availability = [],
) {
  const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);

  return availability.some((range) => {
    if (!range?.startTime || !range?.endTime) return false;

    const rangeStart = new Date(range.startTime);
    const rangeEnd = new Date(range.endTime);

    return slotStart >= rangeStart && slotEnd <= rangeEnd;
  });
}

// export function formatTimeLabel(value) {
//   const date = new Date(value);
//   const hours = String(date.getHours()).padStart(2, "0");
//   const minutes = String(date.getMinutes()).padStart(2, "0");
//   return `${hours}:${minutes}`;
// }
export function formatTimeLabel(value) {
  const date = new Date(value);

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
timeZone: "UTC",
  });
}

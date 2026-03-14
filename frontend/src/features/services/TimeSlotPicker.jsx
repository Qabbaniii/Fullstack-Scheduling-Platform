import { useMemo } from "react";
import {
  generateTimeSlotsForDay,
  isSlotInsideAvailability,
} from "../../utils/bookingTime";

function toUtcMinuteKey(value) {
  if (!value) return "";

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return "";

  const year = d.getUTCFullYear();
  const month = `${d.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${d.getUTCDate()}`.padStart(2, "0");
  const hour = `${d.getUTCHours()}`.padStart(2, "0");
  const minute = `${d.getUTCMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function formatLocalTimeLabel(value) {
  if (!value) return "";

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return "";

  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

function isActiveBookingStatus(status) {
  if (status === null || status === undefined) return false;

  const normalized = String(status).toLowerCase();
  return normalized === "confirmed" || normalized === "pending";
}

export function TimeSlotPicker({
  selectedDate,
  selectedTime,
  onSelectTime,
  availability,
  durationMinutes,
  bookedSlots = [],
}) {
  const bookedKeys = useMemo(() => {
    return bookedSlots
      .filter((booking) => {
        return (
          booking && booking.startTime && isActiveBookingStatus(booking.status)
        );
      })
      .map((booking) => toUtcMinuteKey(booking.startTime));
  }, [bookedSlots]);

  const slots = useMemo(() => {
    if (!selectedDate || !durationMinutes) return [];

    const allSlots = generateTimeSlotsForDay(selectedDate, durationMinutes);

    return allSlots
      .map((slot) => {
        const slotIso = slot.toISOString();
        const slotKey = toUtcMinuteKey(slotIso);

        const available = isSlotInsideAvailability(
          slot,
          durationMinutes,
          availability,
        );

        const booked = bookedKeys.includes(slotKey);

        return {
          value: slotIso, // UTC ISO
          label: formatLocalTimeLabel(slotIso), // Local time for UI
          available,
          booked,
        };
      })
      .filter((slot) => slot.available);
  }, [selectedDate, durationMinutes, availability, bookedKeys]);

  if (!selectedDate) {
    return (
      <div
        style={{
          fontSize: 13,
          color: "var(--text3)",
          padding: 12,
          border: "1px dashed var(--border)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        Select a day first.
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div
        style={{
          fontSize: 13,
          color: "var(--text3)",
          padding: 12,
          border: "1px dashed var(--border)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        No time slots available for this day.
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text2)",
          marginBottom: 10,
        }}
      >
        Select an hour
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 8,
        }}
      >
        {slots.map((slot) => {
          const active = selectedTime === slot.value;
          const disabled = slot.booked;

          return (
            <button
              key={slot.value}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  onSelectTime(slot.value);
                }
              }}
              style={{
                padding: "12px 8px",
                border: "1px solid var(--border)",
                borderRadius: 0,
                background: disabled
                  ? "#6b7280"
                  : active
                    ? "var(--amber)"
                    : "#63c74d",
                color: disabled
                  ? "rgba(255,255,255,0.95)"
                  : active
                    ? "#0e0f13"
                    : "#ffffff",
                fontSize: 15,
                fontWeight: 700,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.8 : 1,
              }}
              title={disabled ? "Already booked" : slot.label}
            >
              {slot.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

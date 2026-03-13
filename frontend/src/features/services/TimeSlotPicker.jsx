import { useMemo } from "react";
import {
  formatTimeLabel,
  generateTimeSlotsForDay,
  isSlotInsideAvailability,
} from "../../utils/bookingTime";

/*test */
function toUtcMinuteKey(value) {
  if (!value) return "";

  const raw = String(value).trim();

  const utcString = raw.endsWith("Z") ? raw : `${raw}Z`;
  const d = new Date(utcString);

  const year = d.getUTCFullYear();
  const month = `${d.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${d.getUTCDate()}`.padStart(2, "0");
  const hour = `${d.getUTCHours()}`.padStart(2, "0");
  const minute = `${d.getUTCMinutes()}`.padStart(2, "0");

  const result = `${year}-${month}-${day}T${hour}:${minute}`;

  /*test */
  console.log("toUtcMinuteKey input:", value, "=>", result);

  return result;
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
  /*test */
  console.log("TimeSlotPicker bookedSlots:", bookedSlots);

  const bookedKeys = useMemo(() => {
    const keys = bookedSlots
      .filter((b) => b && b.startTime && isActiveBookingStatus(b.status))
      .map((b) => toUtcMinuteKey(b.startTime));

    /*test */
    console.log("bookedKeys:", keys);

    return keys;
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

        /*test */
        console.log("---------------");

        /*test */
        console.log("slot raw:", slot);

        /*test */
        console.log("slotIso:", slotIso);

        /*test */
        console.log("slotKey:", slotKey);

        /*test */
        console.log("availability:", availability);

        /*test */
        console.log("bookedSlots:", bookedSlots);

        /*test */
        console.log("bookedKeys:", bookedKeys);

        const booked = bookedKeys.includes(slotKey);

        /*test */
        console.log("booked result:", booked);

        return {
          value: slotIso,
          label: formatTimeLabel(slotIso),
          available,
          booked,
        };
      })
      .filter((slot) => slot.available);
  }, [selectedDate, durationMinutes, availability, bookedKeys, bookedSlots]);

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

          /*test */
          console.log("render slot:", slot);

          return (
            <button
              key={slot.value}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (!disabled) onSelectTime(slot.value);
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

import { useEffect, useMemo, useState } from "react";
import { API } from "../../api/client";
import { Btn } from "../../components/ui/Btn";
import { Modal } from "../../components/ui/Modal";
import { fmt } from "../../utils/format";
import { getAvailableDays } from "../../utils/bookingTime";
import { TimeSlotPicker } from "./TimeSlotPicker";

function getUtcTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeUtcDateOnly(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function formatLocalDateLabel(utcDateString) {
  if (!utcDateString) return "";

  const date = new Date(`${utcDateString}T00:00:00.000Z`);

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function BookingModal({ open, onClose, service, toast, onBooked }) {
  const [availability, setAvailability] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [loadingBookedSlots, setLoadingBookedSlots] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      if (!open || !service?.providerId) return;

      setLoadingAvailability(true);

      try {
        const data = await API.getProviderAvailability(service.providerId);
        if (cancelled) return;

        const safeData = Array.isArray(data) ? data : [];
        setAvailability(safeData);

        const days = getAvailableDays(safeData).map(normalizeUtcDateOnly);
        const utcToday = getUtcTodayString();

        if (days.length > 0) {
          if (days.includes(utcToday)) {
            setSelectedDate(utcToday);
          } else {
            setSelectedDate(days[0]);
          }
        } else {
          setSelectedDate("");
        }
      } catch (err) {
        if (cancelled) return;
        toast(err.message || "Failed to load availability", "error");
        setAvailability([]);
        setSelectedDate("");
      } finally {
        if (!cancelled) {
          setLoadingAvailability(false);
        }
      }
    }

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [open, service?.providerId, toast]);

  useEffect(() => {
    let cancelled = false;

    async function loadBookedSlots() {
      if (!open || !service?.providerId || !selectedDate) {
        setBookedSlots([]);
        return;
      }

      setLoadingBookedSlots(true);

      try {
        const data = await API.getProviderBookings(
          service.providerId,
          selectedDate,
        );

        if (cancelled) return;

        const safeData = Array.isArray(data) ? data : [];

        const activeBookings = safeData.filter((b) => {
          const status = String(b.status || "").toLowerCase();
          return status === "confirmed" || status === "pending";
        });

        setBookedSlots(activeBookings);
      } catch (err) {
        if (cancelled) return;
        toast(err.message || "Failed to load booked slots", "error");
        setBookedSlots([]);
      } finally {
        if (!cancelled) {
          setLoadingBookedSlots(false);
        }
      }
    }

    loadBookedSlots();

    return () => {
      cancelled = true;
    };
  }, [open, service?.providerId, selectedDate, toast]);

  useEffect(() => {
    if (!open) {
      setSelectedDate("");
      setSelectedTime("");
      setAvailability([]);
      setBookedSlots([]);
    }
  }, [open]);

  useEffect(() => {
    setSelectedTime("");
  }, [selectedDate]);

  const availableDays = useMemo(() => {
    return getAvailableDays(availability).map(normalizeUtcDateOnly);
  }, [availability]);

  const submitBooking = async () => {
    if (!selectedTime) {
      toast("Please select a time", "error");
      return;
    }

    setLoadingBooking(true);

    try {
      await API.createBooking({
        serviceId: service.id,
        startTime: selectedTime, // UTC ISO string
      });

      toast("Booking created successfully", "success");
      onBooked?.();
      onClose?.();
    } catch (err) {
      toast(err.message || "Booking failed", "error");
    } finally {
      setLoadingBooking(false);
    }
  };

  if (!service) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Book: ${service.name}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            background: "var(--surface2)",
            borderRadius: "var(--radius-sm)",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <strong style={{ fontSize: 18 }}>{service.name}</strong>

            <span
              style={{
                color: "var(--amber)",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              {fmt.currency(service.price)}
            </span>
          </div>

          <div style={{ color: "var(--text2)", fontSize: 14 }}>
            {service.description}
          </div>

          <div style={{ color: "var(--text3)", fontSize: 13 }}>
            Duration: {service.durationMinutes} minutes
          </div>
        </div>

        {loadingAvailability ? (
          <div style={{ padding: 12, color: "var(--text3)" }}>
            Loading availability...
          </div>
        ) : availability.length === 0 ? (
          <div
            style={{
              background: "var(--red-dim)",
              borderRadius: "var(--radius-sm)",
              padding: 12,
              color: "var(--red)",
              fontSize: 13,
            }}
          >
            No availability found for this provider.
          </div>
        ) : (
          <>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text2)",
                  marginBottom: 6,
                }}
              >
                Select a day
              </div>

              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 12px",
                  color: "var(--text)",
                }}
              >
                {availableDays.map((day) => (
                  <option key={day} value={day}>
                    {formatLocalDateLabel(day)}
                  </option>
                ))}
              </select>
            </div>

            {loadingBookedSlots ? (
              <div style={{ padding: 12, color: "var(--text3)" }}>
                Loading booked slots...
              </div>
            ) : (
              <TimeSlotPicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
                availability={availability}
                durationMinutes={service.durationMinutes}
                bookedSlots={bookedSlots}
              />
            )}
          </>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <Btn type="button" variant="secondary" onClick={onClose}>
            Close
          </Btn>

          <Btn
            type="button"
            loading={loadingBooking}
            disabled={!selectedTime}
            onClick={submitBooking}
          >
            Confirm Booking
          </Btn>
        </div>
      </div>
    </Modal>
  );
}

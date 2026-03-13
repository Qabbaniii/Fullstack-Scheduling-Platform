import { useCallback, useEffect, useState } from "react";
import { API } from "../../api/client";
import { Btn } from "../../components/ui/Btn";
import { EmptyState } from "../../components/ui/EmptyState";
import { fmt } from "../../utils/format";

export function BookingsPage({ toast }) {
  const [bookings, setBookings] = useState([]);

  const load = useCallback(async () => {
    try {
      const data = await API.getMyBookings();
      setBookings(data);
    } catch {
      toast("Failed to load bookings", "error");
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const cancelBooking = async (id) => {
    try {
      await API.cancelBooking(id);
      toast("Booking cancelled", "success");
      load();
    } catch (err) {
      toast(err.message || "Cancel failed", "error");
    }
  };

  return (
    <div>
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <EmptyState
          icon="◻"
          title="No bookings yet"
          desc="Create your first booking"
        />
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
          {bookings.map((b) => (
            <div
              key={b.id}
              style={{ padding: 16, border: "1px solid var(--border)" }}
            >
              <div>{b.serviceName}</div>
              <div>{fmt.date(b.startTime)}</div>
              <div>
                {fmt.time(b.startTime)} - {fmt.time(b.endTime)}
              </div>
              <div>{b.status}</div>
              {(b.status === "Confirmed" || b.status === "Pending") && (
                <Btn variant="danger" onClick={() => cancelBooking(b.id)}>
                  Cancel
                </Btn>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";
import { API } from "../../api/client";
import { Btn } from "../../components/ui/Btn";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { EmptyState } from "../../components/ui/EmptyState";
import { fmt } from "../../utils/format";

export function AvailabilityPage({ toast }) {
  const [slots, setSlots] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ startTime: "", endTime: "" });

  const load = useCallback(async () => {
    try {
      const data = await API.getMyAvailability();
      setSlots(data);
    } catch {
      toast("Failed to load availability", "error");
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.createAvailability(form);
      setForm({ startTime: "", endTime: "" });
      setShowCreate(false);
      load();
      toast("Availability slot added", "success");
    } catch (err) {
      toast(err.message || "Failed to add slot", "error");
    }
  };

  return (
    <div>
      <h1>Availability</h1>
      <Btn onClick={() => setShowCreate(true)}>+ Add Slot</Btn>

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Add Availability Slot"
      >
        <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
          <Input
            label="Start Time"
            type="datetime-local"
            value={form.startTime}
            onChange={(e) =>
              setForm((f) => ({ ...f, startTime: e.target.value }))
            }
          />
          <Input
            label="End Time"
            type="datetime-local"
            value={form.endTime}
            onChange={(e) =>
              setForm((f) => ({ ...f, endTime: e.target.value }))
            }
          />
          <Btn type="submit">Save</Btn>
        </form>
      </Modal>

      {slots.length === 0 ? (
        <EmptyState
          icon="◷"
          title="No availability"
          desc="Add a slot to begin"
        />
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
          {slots.map((slot) => (
            <div
              key={slot.id}
              style={{ padding: 16, border: "1px solid var(--border)" }}
            >
              {fmt.date(slot.startTime)} — {fmt.time(slot.startTime)} to{" "}
              {fmt.time(slot.endTime)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";
import { API } from "../../api/client";
import { useAuth } from "../../auth/useAuth";
import { Btn } from "../../components/ui/Btn";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { Spinner } from "../../components/ui/Spinner";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Modal } from "../../components/ui/Modal";
import { fmt } from "../../utils/format";
import { getAvailableDays } from "../../utils/bookingTime";
import { TimeSlotPicker } from "./TimeSlotPicker";

function ServiceCard({ service, isProvider, onBook }) {
  return (
    <div
      className="slide-in"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "border-color 0.2s ease, transform 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border2)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <h3
          style={{
            fontSize: 20,
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          {service.name}
        </h3>

        <span
          style={{
            color: "var(--amber)",
            fontWeight: 700,
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {fmt.currency(service.price)}
        </span>
      </div>

      <p
        style={{
          fontSize: 14,
          color: "var(--text2)",
          lineHeight: 1.7,
          minHeight: 44,
        }}
      >
        {service.description}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
          paddingTop: 14,
          borderTop: "1px solid var(--border)",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Badge color="gray">⏱ {service.durationMinutes}m</Badge>
          {service.providerName && (
            <span style={{ fontSize: 12, color: "var(--text3)" }}>
              by {service.providerName}
            </span>
          )}
        </div>

        {!isProvider && (
          <Btn size="sm" onClick={() => onBook(service)}>
            Book
          </Btn>
        )}

        {isProvider && <Btn size="sm">View</Btn>}
      </div>
    </div>
  );
}

function CreateServiceModal({ open, onClose, onCreated, toast }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    durationMinutes: 60,
    price: "",
  });

  const [loading, setLoading] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      durationMinutes: 60,
      price: "",
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.createService(form);
      toast("Service created successfully", "success");
      resetForm();
      onCreated();
    } catch (err) {
      toast(err.message || "Failed to create service", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create New Service">
      <form
        onSubmit={submit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <Input
          label="Service Name"
          placeholder="e.g. Deep Tissue Massage"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
        />

        <Textarea
          label="Description"
          placeholder="Describe what customers can expect..."
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          }}
        >
          <Input
            label="Duration (minutes)"
            type="number"
            min={15}
            max={480}
            value={form.durationMinutes}
            onChange={(e) => update("durationMinutes", e.target.value)}
            required
          />

          <Input
            label="Price"
            type="number"
            min={0}
            step="0.01"
            placeholder="0.00"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            required
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 4,
          }}
        >
          <Btn type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Btn>

          <Btn type="submit" loading={loading}>
            Create Service
          </Btn>
        </div>
      </form>
    </Modal>
  );
}

function BookingModal({ open, onClose, service, toast, onBooked }) {
  const [availability, setAvailability] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    async function loadAvailability() {
      if (!open || !service?.providerId) return;

      setLoadingAvailability(true);
      try {
        const data = await API.getProviderAvailability(service.providerId);
        setAvailability(data);

        const days = getAvailableDays(data);
        if (days.length > 0) {
          setSelectedDate(days[0]);
        }
      } catch (err) {
        toast(err.message || "Failed to load availability", "error");
        setAvailability([]);
      } finally {
        setLoadingAvailability(false);
      }
    }

    loadAvailability();
  }, [open, service, toast]);

  useEffect(() => {
    if (!open) {
      setSelectedDate("");
      setSelectedTime("");
      setAvailability([]);
    }
  }, [open]);

  useEffect(() => {
    setSelectedTime("");
  }, [selectedDate]);

  const availableDays = getAvailableDays(availability);

  const submitBooking = async () => {
    if (!selectedTime) {
      toast("Please select a time", "error");
      return;
    }

    setLoadingBooking(true);
    try {
      await API.createBooking({
        serviceId: service.id,
        startTime: selectedTime,
      });

      toast("Booking created successfully", "success");
      onBooked();
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
            padding: 14,
            display: "flex",
            gap: 16,
            flexDirection: "column",
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
              style={{ color: "var(--amber)", fontWeight: 700, fontSize: 18 }}
            >
              {fmt.currency(service.price)}
            </span>
          </div>

          <div style={{ fontSize: 14, color: "var(--text2)" }}>
            {service.description}
          </div>

          <div style={{ fontSize: 13, color: "var(--text3)" }}>
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
                  marginBottom: 8,
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
                  padding: "11px 14px",
                  color: "var(--text)",
                  fontSize: 14,
                }}
              >
                {availableDays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <TimeSlotPicker
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
              availability={availability}
              durationMinutes={service.durationMinutes}
            />
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
            disabled={!selectedTime || availability.length === 0}
            onClick={submitBooking}
          >
            Confirm Booking
          </Btn>
        </div>
      </div>
    </Modal>
  );
}

export function ServicesPage({ toast }) {
  const { user } = useAuth();
  const isProvider = user?.role === "Provider";

  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const loadServices = useCallback(async () => {
    setLoading(true);

    try {
      const data = await API.getServices(search);
      setServices(data);
    } catch {
      toast("Failed to load services", "error");
    } finally {
      setLoading(false);
    }
  }, [search, toast]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleCreated = async () => {
    setShowCreateModal(false);
    await loadServices();
  };

  const handleBooked = () => {
    setSelectedService(null);
  };

  return (
    <div className="fade-in">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            {isProvider ? "Your Services" : "Browse Services"}
          </h1>

          <p
            style={{
              color: "var(--text3)",
              fontSize: 14,
            }}
          >
            {isProvider
              ? "Manage and review the services you offer"
              : "Find a service that suits your needs"}
          </p>
        </div>

        {isProvider && (
          <Btn onClick={() => setShowCreateModal(true)}>+ New Service</Btn>
        )}
      </div>

      <div style={{ position: "relative", marginBottom: 24 }}>
        <span
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text3)",
            fontSize: 16,
          }}
        >
          ⌕
        </span>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services..."
          style={{
            width: "100%",
            maxWidth: 420,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            padding: "11px 14px 11px 40px",
            color: "var(--text)",
            fontSize: 14,
            outline: "none",
          }}
        />
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <Spinner size={32} />
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          icon="◈"
          title="No services found"
          desc={
            search ? "Try another search term" : "No services available yet"
          }
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 18,
          }}
        >
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isProvider={isProvider}
              onBook={setSelectedService}
            />
          ))}
        </div>
      )}

      <CreateServiceModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleCreated}
        toast={toast}
      />

      <BookingModal
        open={!!selectedService}
        onClose={() => setSelectedService(null)}
        service={selectedService}
        toast={toast}
        onBooked={handleBooked}
      />
    </div>
  );
}

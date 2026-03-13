import { http } from "./http";

const handleError = (err) => {
  const msg =
    err?.response?.data?.detail ||
    err?.response?.data?.message ||
    err?.response?.data?.title ||
    err?.response?.data ||
    err?.message ||
    "An unexpected error occurred.";

  const status = err?.response?.status || 500;

  throw {
    status,
    message: typeof msg === "string" ? msg : JSON.stringify(msg),
  };
};

export const API = {
  async register(payload) {
    try {
      const roleMap = {
        Customer: 0,
        Provider: 1,
      };

      const { data } = await http.post("/api/auth/register", {
        ...payload,
        role: roleMap[payload.role] ?? payload.role,
      });

      return data;
    } catch (err) {
      handleError(err);
    }
  },

  async login(payload) {
    try {
      const { data } = await http.post("/api/auth/login", payload);
      return data;
    } catch (err) {
      handleError(err);
    }
  },

  async getServices(search = "") {
    try {
      const { data } = await http.get("/api/services", {
        params: search ? { search } : {},
      });

      return Array.isArray(data) ? data : (data?.data ?? []);
    } catch (err) {
      handleError(err);
    }
  },

  async getServiceById(id) {
    try {
      const { data } = await http.get(`/api/services/${id}`);
      return data;
    } catch (err) {
      handleError(err);
    }
  },

  async createService(payload) {
    try {
      const { data } = await http.post("/api/services", {
        name: payload.name,
        description: payload.description,
        durationMinutes: Number(payload.durationMinutes),
        price: Number(payload.price),
      });

      return data;
    } catch (err) {
      handleError(err);
    }
  },

  async createAvailability(payload) {
    try {
      const { data } = await http.post("/api/availability", payload);
      return data;
    } catch (err) {
      handleError(err);
    }
  },

  async getMyAvailability() {
    try {
      const { data } = await http.get("/api/availability");
      return Array.isArray(data) ? data : (data?.data ?? []);
    } catch (err) {
      handleError(err);
    }
  },

  async getProviderAvailability(providerId) {
    try {
      const { data } = await http.get(
        `/api/availability/provider/${providerId}`,
      );
      return Array.isArray(data) ? data : (data?.data ?? []);
    } catch (err) {
      handleError(err);
    }
  },

  async getProviderBookings(providerId, date) {
    try {
      const { data } = await http.get(`/api/bookings/provider/${providerId}`, {
        params: { date },
      });
      return Array.isArray(data) ? data : (data?.data ?? []);
    } catch (err) {
      handleError(err);
    }
  },

  async createBooking(payload) {
    try {
      const { data } = await http.post("/api/bookings", payload);
      return data;
    } catch (err) {
      handleError(err);
    }
  },

  async getMyBookings() {
    try {
      const { data } = await http.get("/api/bookings/mybookings");
      return Array.isArray(data) ? data : (data?.data ?? []);
    } catch (err) {
      handleError(err);
    }
  },

  async cancelBooking(bookingId) {
    try {
      const { data } = await http.put(`/api/bookings/cancel/${bookingId}`);
      return data;
    } catch (err) {
      handleError(err);
    }
  },
};

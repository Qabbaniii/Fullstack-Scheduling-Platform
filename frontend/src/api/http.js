import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("schedulr_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

import axios from "axios";
import type { Invoice, AppUser } from "../types";

const BASE = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const api = axios.create({ baseURL: BASE });
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ── Auth ── */
export const authApi = {
  login: async (email: string, password: string) => {
    const r = await axios.post(`${BASE}/auth/login`, { email, password });
    localStorage.setItem("token", r.data.token);
    return r.data;
  },

  
  register: async (name: string, email: string, password: string) => {
    const r = await axios.post(`${BASE}/auth/register`, { name, email, password });
    localStorage.setItem("token", r.data.token);
    return r.data;
  },

  logout: () => localStorage.removeItem("token"),
};

/* ── Invoice API ── */
export const invoiceApi = {
  getAll: () => api.get<Invoice[]>("/invoices").then((r) => r.data),
  create: (payload: Omit<Invoice, "id">) => api.post<Invoice>("/invoices", payload).then((r) => r.data),
  update: (id: string, payload: Partial<Omit<Invoice, "id">>) => api.put<Invoice>(`/invoices/${id}`, payload).then((r) => r.data),
  pay:    (id: string) => api.patch<Invoice>(`/invoices/${id}/pay`).then((r) => r.data),
  remove: (id: string) => api.delete(`/invoices/${id}`).then((r) => r.data),
};

/* ── User API ── */
export const userApi = {
  getAll:       () => api.get<AppUser[]>("/users").then((r) => r.data),
  create:       (payload: Omit<AppUser, "id" | "joined">) => api.post<AppUser>("/users", payload).then((r) => r.data),
  update:       (id: string, payload: Partial<Omit<AppUser, "id">>) => api.put<AppUser>(`/users/${id}`, payload).then((r) => r.data),
  toggleStatus: (id: string) => api.patch<AppUser>(`/users/${id}/toggle-status`).then((r) => r.data),
  remove:       (id: string) => api.delete(`/users/${id}`).then((r) => r.data),
};
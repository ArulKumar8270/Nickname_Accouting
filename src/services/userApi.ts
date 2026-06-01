import axios from "axios";
import type { UserInvoice, Expense, GSTFiling, Activity } from "../types/user";

const BASE = "http://localhost:5000/api";

// JWT interceptor instance
const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ── User Invoice API ── */
export const userInvoiceApi = {
  getAll: () =>
    api.get<UserInvoice[]>("/user-invoices").then((r) => r.data),

  create: (payload: Omit<UserInvoice, "id">) =>
    api.post<UserInvoice>("/user-invoices", payload).then((r) => r.data),

  update: (id: string, payload: Partial<Omit<UserInvoice, "id">>) =>
    api.put<UserInvoice>(`/user-invoices/${id}`, payload).then((r) => r.data),

  pay: (id: string) =>
    api.patch<UserInvoice>(`/user-invoices/${id}/pay`).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/user-invoices/${id}`).then((r) => r.data),
};

/* ── Expense API ── */
export const expenseApi = {
  getAll: () =>
    api.get<Expense[]>("/expenses").then((r) => r.data),

  create: (payload: Omit<Expense, "id">) =>
    api.post<Expense>("/expenses", payload).then((r) => r.data),

  update: (id: string, payload: Partial<Omit<Expense, "id">>) =>
    api.put<Expense>(`/expenses/${id}`, payload).then((r) => r.data),

  pay: (id: string) =>
    api.patch<Expense>(`/expenses/${id}/pay`).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/expenses/${id}`).then((r) => r.data),
};

/* ── GST API ── */
export const gstApi = {
  getFilings: () =>
    api.get<GSTFiling[]>("/gst").then((r) => r.data),

  file: (form: string, period: string) =>
    api.post("/gst/file", { form, period }).then((r) => r.data),
};

/* ── Activity API ── */
export const activityApi = {
  getAll: () =>
    api.get<Activity[]>("/activity").then((r) => r.data),
};
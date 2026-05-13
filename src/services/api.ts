import axios from "axios";
import type { Invoice, AppUser, InvoiceStatus, UserRole, UserStatus } from "../types";

const BASE = "http://localhost:5000/api";

/* ── Invoice API ── */
export const invoiceApi = {
  getAll: () =>
    axios.get<Invoice[]>(`${BASE}/invoices`).then((r) => r.data),

  create: (payload: Omit<Invoice, "id">) =>
    axios.post<Invoice>(`${BASE}/invoices`, payload).then((r) => r.data),

  update: (id: string, payload: Partial<Omit<Invoice, "id">>) =>
    axios.put<Invoice>(`${BASE}/invoices/${id}`, payload).then((r) => r.data),

  pay: (id: string) =>
    axios.patch<Invoice>(`${BASE}/invoices/${id}/pay`).then((r) => r.data),

  remove: (id: string) =>
    axios.delete(`${BASE}/invoices/${id}`).then((r) => r.data),
};

/* ── User API ── */
export const userApi = {
  getAll: () =>
    axios.get<AppUser[]>(`${BASE}/users`).then((r) => r.data),

  create: (payload: Omit<AppUser, "id" | "joined">) =>
    axios.post<AppUser>(`${BASE}/users`, payload).then((r) => r.data),

  update: (id: string, payload: Partial<Omit<AppUser, "id">>) =>
    axios.put<AppUser>(`${BASE}/users/${id}`, payload).then((r) => r.data),

  toggleStatus: (id: string) =>
    axios.patch<AppUser>(`${BASE}/users/${id}/toggle-status`).then((r) => r.data),

  remove: (id: string) =>
    axios.delete(`${BASE}/users/${id}`).then((r) => r.data),
};
import axios from "axios";
import type { UserInvoice, Expense, GSTFiling, Activity } from "../types/user";

const BASE = "http://localhost:5000/api";

export const userInvoiceApi = {
  getAll: () => axios.get<UserInvoice[]>(`${BASE}/user-invoices`).then((r) => r.data),
  create: (payload: Omit<UserInvoice, "id">) => axios.post<UserInvoice>(`${BASE}/user-invoices`, payload).then((r) => r.data),
  update: (id: string, payload: Partial<Omit<UserInvoice, "id">>) => axios.put<UserInvoice>(`${BASE}/user-invoices/${id}`, payload).then((r) => r.data),
  pay: (id: string) => axios.patch<UserInvoice>(`${BASE}/user-invoices/${id}`, { status: "Paid" }).then((r) => r.data),
  remove: (id: string) => axios.delete(`${BASE}/user-invoices/${id}`).then((r) => r.data),
};

export const expenseApi = {
  getAll: () => axios.get<Expense[]>(`${BASE}/expenses`).then((r) => r.data),
  create: (payload: Omit<Expense, "id">) => axios.post<Expense>(`${BASE}/expenses`, payload).then((r) => r.data),
  update: (id: string, payload: Partial<Omit<Expense, "id">>) => axios.put<Expense>(`${BASE}/expenses/${id}`, payload).then((r) => r.data),
  pay: (id: string) => axios.patch<Expense>(`${BASE}/expenses/${id}`, { status: "Paid" }).then((r) => r.data),
  remove: (id: string) => axios.delete(`${BASE}/expenses/${id}`).then((r) => r.data),
};

export const gstApi = {
  getFilings: () => axios.get<GSTFiling[]>(`${BASE}/gst`).then((r) => r.data),
  file: (form: string, period: string) => axios.post(`${BASE}/gst`, { form, period, status: "Paid" }).then((r) => r.data),
};

export const activityApi = {
  getAll: () => axios.get<Activity[]>(`${BASE}/activity`).then((r) => r.data),
};
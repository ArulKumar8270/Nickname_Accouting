export type Role = "admin" | "user";

export interface AuthUser {
  name: string;
  email: string;
  role: Role;
}

export interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
}

export interface Credential {
  username: string;
  password: string;
  user: AuthUser;
}

export interface Invoice {
  id: string;
  vendor: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue" | "Sent" | "Draft";
}

export interface UserInvoice {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue" | "Sent" | "Draft";
}

export interface Expense {
  id: string;
  category: string;
  vendor: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending";
}

export interface GSTFiling {
  form: string;
  period: string;
  due: string;
  status: "Paid" | "Pending";
}

export interface UserRecord {
  name: string;
  email: string;
  role: Role;
  status: "Active" | "Inactive";
  joined: string;
}

export interface Activity {
  time: string;
  text: string;
  icon: string;
  color: string;
}

export type AdminPage = "overview" | "invoices" | "users" | "reports" | "settings";
export type UserPage  = "dashboard" | "invoices" | "expenses" | "gst" | "activity";
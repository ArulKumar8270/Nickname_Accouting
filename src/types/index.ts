export type InvoiceStatus = "Pending" | "Paid" | "Overdue";
export type UserRole = "Admin" | "User";
export type UserStatus = "Active" | "Inactive";

export interface Invoice {
  id: string;
  vendor: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joined: string;
}

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
}
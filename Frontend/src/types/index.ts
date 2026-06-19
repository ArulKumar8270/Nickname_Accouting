export type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Sent" | "Draft";
export type ExpenseStatus = "Paid" | "Pending";
export type GSTStatus     = "Paid" | "Pending";

// ✅ ADD THIS
export interface AuthUser {
  id:    string;
  name:  string;
  email: string;
  role?: string;
}

export interface UserInvoice {
  id:       string;
  customer: string;
  date:     string;
  amount:   number;
  status:   InvoiceStatus;
}

export interface Expense {
  id:       string;
  category: string;
  vendor:   string;
  date:     string;
  amount:   number;
  status:   ExpenseStatus;
}

export interface GSTFiling {
  form:   string;
  period: string;
  due:    string;
  status: GSTStatus;
}

export interface Activity {
  time:  string;
  text:  string;
  icon:  string;
  color: string;
}

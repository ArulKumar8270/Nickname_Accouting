import type { Invoice, UserInvoice, Expense, GSTFiling, UserRecord, Activity } from "../types";

export const INVOICES: Invoice[] = [
  { id: "INV-001", vendor: "AWS India",        date: "Mar 28", amount: 48200, status: "Pending" },
  { id: "INV-002", vendor: "Razorpay",         date: "Mar 25", amount: 12500, status: "Paid"    },
  { id: "INV-003", vendor: "Google Workspace", date: "Mar 20", amount: 6800,  status: "Paid"    },
  { id: "INV-004", vendor: "Zoho Corp",        date: "Mar 15", amount: 9500,  status: "Overdue" },
  { id: "INV-005", vendor: "Freshworks",       date: "Mar 10", amount: 15000, status: "Pending" },
];

export const USER_INVOICES: UserInvoice[] = [
  { id: "INV-041", customer: "Rajesh Traders",     date: "Mar 28", amount: 45000,  status: "Paid"    },
  { id: "INV-042", customer: "Meena Enterprises",  date: "Mar 26", amount: 120000, status: "Sent"    },
  { id: "INV-043", customer: "Karthik & Co",       date: "Mar 24", amount: 78500,  status: "Overdue" },
  { id: "INV-044", customer: "Sri Murugan Stores", date: "Mar 22", amount: 234000, status: "Pending" },
  { id: "INV-045", customer: "Anbu Industries",    date: "Mar 20", amount: 56750,  status: "Paid"    },
];

export const EXPENSES: Expense[] = [
  { id: "EXP-001", category: "Office Rent",       vendor: "Krishna Properties", date: "Mar 1",  amount: 35000, status: "Paid"    },
  { id: "EXP-002", category: "Internet & Phone",  vendor: "BSNL / Airtel",      date: "Mar 5",  amount: 4500,  status: "Paid"    },
  { id: "EXP-003", category: "Software License",  vendor: "Zoho Corporation",   date: "Mar 8",  amount: 12000, status: "Paid"    },
  { id: "EXP-004", category: "Travel",            vendor: "Self",               date: "Mar 12", amount: 8200,  status: "Pending" },
  { id: "EXP-005", category: "Staff Salary",      vendor: "Payroll",            date: "Mar 31", amount: 85000, status: "Pending" },
];

export const GST_FILINGS: GSTFiling[] = [
  { form: "GSTR-3B", period: "Mar 2024", due: "Apr 20", status: "Pending" },
  { form: "GSTR-1",  period: "Mar 2024", due: "Apr 11", status: "Pending" },
  { form: "GSTR-3B", period: "Feb 2024", due: "Mar 20", status: "Paid"    },
  { form: "GSTR-1",  period: "Feb 2024", due: "Mar 11", status: "Paid"    },
];

export const USERS_LIST: UserRecord[] = [
  { name: "Sam Rivera",  email: "user@company.com",  role: "user",  status: "Active",   joined: "Jan 2024" },
  { name: "Priya Nair",  email: "priya@company.com", role: "user",  status: "Active",   joined: "Feb 2024" },
  { name: "Raj Kumar",   email: "raj@company.com",   role: "user",  status: "Inactive", joined: "Mar 2024" },
  { name: "Alex Carter", email: "admin@company.com", role: "admin", status: "Active",   joined: "Dec 2023" },
];

export const ACTIVITIES: Activity[] = [
  { time: "2 min ago",   text: "Logged in successfully",              icon: "🔐", color: "text-emerald-400" },
  { time: "1 hr ago",    text: "Invoice INV-045 marked as Paid",       icon: "✅", color: "text-emerald-400" },
  { time: "3 hrs ago",   text: "New expense EXP-005 added",            icon: "💸", color: "text-amber-400"   },
  { time: "Yesterday",   text: "GSTR-3B filing initiated",             icon: "📋", color: "text-blue-400"    },
  { time: "2 days ago",  text: "Invoice INV-043 became overdue",       icon: "⚠️", color: "text-red-400"     },
  { time: "3 days ago",  text: "Bank reconciliation completed (83%)",  icon: "🏦", color: "text-violet-400"  },
];

export const fmt = (n: number): string => "₹" + n.toLocaleString("en-IN");
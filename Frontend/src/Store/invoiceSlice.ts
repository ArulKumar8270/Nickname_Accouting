import { createSlice, configureStore } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
export type InvoiceStatus = "Pending" | "Paid" | "Overdue";
export type UserRole      = "Admin" | "User";
export type UserStatus    = "Active" | "Inactive";

export interface Invoice {
  id:     string;
  vendor: string;
  date:   string;
  amount: number;
  status: InvoiceStatus;
}

export interface AppUser {
  id:     string;
  name:   string;
  email:  string;
  role:   UserRole;
  status: UserStatus;
  joined: string;
}

/* ─────────────────────────────────────────────
   Seed Data
───────────────────────────────────────────── */
const SEED_INVOICES: Invoice[] = [
  { id: "INV-001", vendor: "AWS India",        date: "Mar 28", amount: 48200, status: "Pending" },
  { id: "INV-002", vendor: "Razorpay",         date: "Mar 25", amount: 12500, status: "Paid"    },
  { id: "INV-003", vendor: "Google Workspace", date: "Mar 20", amount:  6800, status: "Paid"    },
  { id: "INV-004", vendor: "Zoho Corp",        date: "Mar 15", amount:  9500, status: "Overdue" },
  { id: "INV-005", vendor: "Freshworks",       date: "Mar 10", amount: 15000, status: "Pending" },
];

const SEED_USERS: AppUser[] = [
  { id: "u1", name: "Alex Carter",  email: "alex@nexus.in",  role: "Admin", status: "Active",   joined: "Jan 2024" },
  { id: "u2", name: "Priya Sharma", email: "priya@nexus.in", role: "User",  status: "Active",   joined: "Feb 2024" },
  { id: "u3", name: "Rahul Dev",    email: "rahul@nexus.in", role: "User",  status: "Inactive", joined: "Mar 2024" },
];

/* ─────────────────────────────────────────────
   Helper — Generate next ID
───────────────────────────────────────────── */
export const genId = (prefix: string, list: { id: string }[]) => {
  const nums = list.map((x) => parseInt(x.id.replace(/\D/g, ""), 10)).filter(Boolean);
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `${prefix}-${String(next).padStart(3, "0")}`;
};

/* ─────────────────────────────────────────────
   Invoice Slice
───────────────────────────────────────────── */
const invoiceSlice = createSlice({
  name: "invoices",
  initialState: SEED_INVOICES,
  reducers: {
    addInvoice: (state, action: PayloadAction<Omit<Invoice, "id">>) => {
      const newInvoice: Invoice = {
        id: genId("INV", state),
        ...action.payload,
      };
      state.unshift(newInvoice);
    },

    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      const index = state.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },

    payInvoice: (state, action: PayloadAction<string>) => {
      const invoice = state.find((i) => i.id === action.payload);
      if (invoice) invoice.status = "Paid";
    },

    deleteInvoice: (state, action: PayloadAction<string>) => {
      return state.filter((i) => i.id !== action.payload);
    },
  },
});

/* ─────────────────────────────────────────────
   User Slice
───────────────────────────────────────────── */
const userSlice = createSlice({
  name: "users",
  initialState: SEED_USERS,
  reducers: {
    addUser: (state, action: PayloadAction<Omit<AppUser, "id" | "joined">>) => {
      const newUser: AppUser = {
        id:     `u${Date.now()}`,
        joined: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
        ...action.payload,
      };
      state.push(newUser);
    },

    updateUser: (state, action: PayloadAction<AppUser>) => {
      const index = state.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },

    toggleUserStatus: (state, action: PayloadAction<string>) => {
      const user = state.find((u) => u.id === action.payload);
      if (user) user.status = user.status === "Active" ? "Inactive" : "Active";
    },

    deleteUser: (state, action: PayloadAction<string>) => {
      return state.filter((u) => u.id !== action.payload);
    },
  },
});

/* ─────────────────────────────────────────────
   Export Actions
───────────────────────────────────────────── */
export const {
  addInvoice, updateInvoice, payInvoice, deleteInvoice,
} = invoiceSlice.actions;

export const {
  addUser, updateUser, toggleUserStatus, deleteUser,
} = userSlice.actions;


export const adminStore = configureStore({
  reducer: {
    invoices: invoiceSlice.reducer,
    users:    userSlice.reducer,
  },
  devTools: true, 
});

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
export type AdminRootState = ReturnType<typeof adminStore.getState>;
export type AdminDispatch  = typeof adminStore.dispatch;
import { useState } from "react";
import type { AuthUser, UserPage } from "../types";
import { fmt } from "../constants/data";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import {
  HomeIcon, InvoiceIcon, DollarIcon, ShieldIcon, ActivityIcon, AlertIcon,
} from "../components/Icons";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Sent" | "Draft";
type ExpenseStatus = "Paid" | "Pending";
type GSTStatus     = "Paid" | "Pending";

interface UserInvoice {
  id:       string;
  customer: string;
  date:     string;
  amount:   number;
  status:   InvoiceStatus;
}

interface Expense {
  id:       string;
  category: string;
  vendor:   string;
  date:     string;
  amount:   number;
  status:   ExpenseStatus;
}

interface GSTFiling {
  form:   string;
  period: string;
  due:    string;
  status: GSTStatus;
}

interface Activity {
  time:  string;
  text:  string;
  icon:  string;
  color: string;
}

/* ─────────────────────────────────────────────
   Seed Data
───────────────────────────────────────────── */
const SEED_INVOICES: UserInvoice[] = [
  { id: "INV-041", customer: "Rajesh Traders",     date: "Mar 28", amount: 45000,  status: "Paid"    },
  { id: "INV-042", customer: "Meena Enterprises",  date: "Mar 26", amount: 120000, status: "Sent"    },
  { id: "INV-043", customer: "Karthik & Co",       date: "Mar 24", amount: 78500,  status: "Overdue" },
  { id: "INV-044", customer: "Sri Murugan Stores", date: "Mar 22", amount: 234000, status: "Pending" },
  { id: "INV-045", customer: "Anbu Industries",    date: "Mar 20", amount: 56750,  status: "Paid"    },
];

const SEED_EXPENSES: Expense[] = [
  { id: "EXP-001", category: "Office Rent",       vendor: "Krishna Properties", date: "Mar 1",  amount: 35000, status: "Paid"    },
  { id: "EXP-002", category: "Internet & Phone",  vendor: "BSNL / Airtel",      date: "Mar 5",  amount: 4500,  status: "Paid"    },
  { id: "EXP-003", category: "Software License",  vendor: "Zoho Corporation",   date: "Mar 8",  amount: 12000, status: "Paid"    },
  { id: "EXP-004", category: "Travel",            vendor: "Self",               date: "Mar 12", amount: 8200,  status: "Pending" },
  { id: "EXP-005", category: "Staff Salary",      vendor: "Payroll",            date: "Mar 31", amount: 85000, status: "Pending" },
];

const SEED_GST: GSTFiling[] = [
  { form: "GSTR-3B", period: "Mar 2024", due: "Apr 20", status: "Pending" },
  { form: "GSTR-1",  period: "Mar 2024", due: "Apr 11", status: "Pending" },
  { form: "GSTR-3B", period: "Feb 2024", due: "Mar 20", status: "Paid"    },
  { form: "GSTR-1",  period: "Feb 2024", due: "Mar 11", status: "Paid"    },
];

const SEED_ACTIVITIES: Activity[] = [
  { time: "2 min ago",  text: "Logged in successfully",              icon: "🔐", color: "text-emerald-700" },
  { time: "1 hr ago",   text: "Invoice INV-045 marked as Paid",      icon: "✅", color: "text-emerald-700" },
  { time: "3 hrs ago",  text: "New expense EXP-005 added",           icon: "💸", color: "text-amber-700"   },
  { time: "Yesterday",  text: "GSTR-3B filing initiated",            icon: "📋", color: "text-blue-700"    },
  { time: "2 days ago", text: "Invoice INV-043 became overdue",      icon: "⚠️", color: "text-red-700"     },
  { time: "3 days ago", text: "Bank reconciliation completed (83%)", icon: "🏦", color: "text-violet-700"  },
];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const genId = (prefix: string, list: { id: string }[]) => {
  const nums = list.map((x) => parseInt(x.id.replace(/\D/g, ""), 10)).filter(Boolean);
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `${prefix}-${String(next).padStart(3, "0")}`;
};

const today = () =>
  new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

/* ─────────────────────────────────────────────
   Nav
───────────────────────────────────────────── */
interface UserDashboardProps { user: AuthUser; onLogout: () => void; }

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",  icon: HomeIcon     },
  { id: "invoices",  label: "Invoices",   icon: InvoiceIcon  },
  { id: "expenses",  label: "Expenses",   icon: DollarIcon   },
  { id: "gst",       label: "GST Filing", icon: ShieldIcon   },
  { id: "activity",  label: "Activity",   icon: ActivityIcon },
];

const PAGE_TITLES: Record<UserPage, string> = {
  dashboard: "Dashboard",
  invoices:  "Invoices",
  expenses:  "Expenses",
  gst:       "GST Filing",
  activity:  "Activity",
};

/* ─────────────────────────────────────────────
   Shared UI
───────────────────────────────────────────── */
function TH({ children }: { children: string }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
      {children}
    </th>
  );
}

const inputCls =
  "w-full px-3 py-2.5 rounded-xl text-sm text-slate-800 outline-none border border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Modal wrapper
───────────────────────────────────────────── */
function Modal({ title, onClose, children }: {
  title: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-slate-800 font-bold text-base">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all text-lg"
          >×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Confirm Delete
───────────────────────────────────────────── */
function ConfirmDelete({ label, onConfirm, onCancel }: {
  label: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <Modal title="Confirm Delete" onClose={onCancel}>
      <p className="text-slate-600 text-sm mb-6">
        Delete <span className="font-bold text-slate-800">{label}</span>? This cannot be undone.
      </p>
      <div className="flex gap-3 justify-end">
        <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
          Cancel
        </button>
        <button onClick={onConfirm} className="px-4 py-2 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-all">
          Delete
        </button>
      </div>
    </Modal>
  );
}

/* ─────────────────────────────────────────────
   Invoice Modal (Add / Edit)
───────────────────────────────────────────── */
function InvoiceModal({ initial, onSave, onClose }: {
  initial?: Partial<UserInvoice>;
  onSave:   (data: Omit<UserInvoice, "id">) => void;
  onClose:  () => void;
}) {
  const [customer, setCustomer] = useState(initial?.customer ?? "");
  const [date,     setDate]     = useState(initial?.date     ?? today());
  const [amount,   setAmount]   = useState(String(initial?.amount ?? ""));
  const [status,   setStatus]   = useState<InvoiceStatus>(initial?.status ?? "Pending");
  const [error,    setError]    = useState("");

  const submit = () => {
    if (!customer.trim()) return setError("Customer பேர் போடுங்க");
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return setError("சரியான amount போடுங்க");
    setError("");
    onSave({ customer: customer.trim(), date, amount: Number(amount), status });
  };

  return (
    <Modal title={initial?.id ? "Edit Invoice" : "New Invoice"} onClose={onClose}>
      <div className="space-y-4">
        <Field label="Customer">
          <input className={inputCls} value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="e.g. Rajesh Traders" />
        </Field>
        <Field label="Date">
          <input className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g. Apr 16" />
        </Field>
        <Field label="Amount (₹)">
          <input className={inputCls} type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 45000" />
        </Field>
        <Field label="Status">
          <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as InvoiceStatus)}>
            <option>Pending</option>
            <option>Sent</option>
            <option>Paid</option>
            <option>Overdue</option>
            <option>Draft</option>
          </select>
        </Field>
        {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
        <div className="flex gap-3 justify-end pt-1">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
          <button onClick={submit} className="px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all">
            {initial?.id ? "Save Changes" : "Create Invoice"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ─────────────────────────────────────────────
   Expense Modal (Add / Edit)
───────────────────────────────────────────── */
function ExpenseModal({ initial, onSave, onClose }: {
  initial?: Partial<Expense>;
  onSave:   (data: Omit<Expense, "id">) => void;
  onClose:  () => void;
}) {
  const [category, setCategory] = useState(initial?.category ?? "");
  const [vendor,   setVendor]   = useState(initial?.vendor   ?? "");
  const [date,     setDate]     = useState(initial?.date     ?? today());
  const [amount,   setAmount]   = useState(String(initial?.amount ?? ""));
  const [status,   setStatus]   = useState<ExpenseStatus>(initial?.status ?? "Pending");
  const [error,    setError]    = useState("");

  const submit = () => {
    if (!category.trim()) return setError("Category போடுங்க");
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return setError("சரியான amount போடுங்க");
    setError("");
    onSave({ category: category.trim(), vendor: vendor.trim(), date, amount: Number(amount), status });
  };

  return (
    <Modal title={initial?.id ? "Edit Expense" : "Add Expense"} onClose={onClose}>
      <div className="space-y-4">
        <Field label="Category">
          <input className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Office Rent" />
        </Field>
        <Field label="Vendor">
          <input className={inputCls} value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="e.g. Krishna Properties" />
        </Field>
        <Field label="Date">
          <input className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g. Apr 16" />
        </Field>
        <Field label="Amount (₹)">
          <input className={inputCls} type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 35000" />
        </Field>
        <Field label="Status">
          <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as ExpenseStatus)}>
            <option>Pending</option>
            <option>Paid</option>
          </select>
        </Field>
        {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
        <div className="flex gap-3 justify-end pt-1">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
          <button onClick={submit} className="px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all">
            {initial?.id ? "Save Changes" : "Add Expense"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ─────────────────────────────────────────────
   Dashboard Overview
───────────────────────────────────────────── */
function UserOverview({ user, invoices, expenses }: {
  user: AuthUser; invoices: UserInvoice[]; expenses: Expense[];
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-lg">Hello, {user.name.split(" ")[0]}! 👋</h2>
            <p className="text-blue-100 text-sm mt-1">
              GST return due in <span className="text-yellow-300 font-semibold">21 days</span> · Mar 2024 is open.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<InvoiceIcon className="w-5 h-5" />}  label="Total Invoiced" value={fmt(invoices.reduce((s, i) => s + i.amount, 0))}                                    sub={`${invoices.length} invoices`} accent="blue"   />
        <StatCard icon={<DollarIcon className="w-5 h-5" />}   label="Total Expenses" value={fmt(expenses.reduce((s, e) => s + e.amount, 0))}                                    sub={`${expenses.length} expenses`} accent="amber"  />
        <StatCard icon={<ShieldIcon className="w-5 h-5" />}   label="GST Payable"    value="₹68,931"                                                                             sub="Due Apr 20"                    accent="red"    />
        <StatCard icon={<ActivityIcon className="w-5 h-5" />} label="Outstanding"    value={fmt(invoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0))} sub="Unpaid"                        accent="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-slate-800 font-bold text-sm">Recent Invoices</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {invoices.slice(0, 4).map((inv) => (
              <div key={inv.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <div className="text-slate-800 text-sm font-semibold">{inv.customer}</div>
                  <div className="text-slate-400 text-xs">{inv.id}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-800 text-sm font-bold">{fmt(inv.amount)}</span>
                  <Badge status={inv.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-slate-800 font-bold text-sm mb-4">GST Summary — Mar 2024</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Output GST",    "₹80,037", "text-red-700",     "bg-red-50 border-red-200"        ],
              ["ITC Available", "₹11,106", "text-emerald-700", "bg-emerald-50 border-emerald-200" ],
              ["Net Payable",   "₹68,931", "text-amber-700",   "bg-amber-50 border-amber-200"     ],
              ["Due Date",      "Apr 20",  "text-blue-700",    "bg-blue-50 border-blue-200"       ],
            ].map(([l, v, c, bg]) => (
              <div key={l} className={`text-center py-3 px-2 rounded-xl border ${bg}`}>
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">{l}</div>
                <div className={`text-sm font-extrabold ${c}`}>{v}</div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all">
            File GST Return →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Invoices — CRUD
───────────────────────────────────────────── */
function UserInvoices({ invoices, setInvoices }: {
  invoices:    UserInvoice[];
  setInvoices: React.Dispatch<React.SetStateAction<UserInvoice[]>>;
}) {
  const [filter,       setFilter]       = useState("All");
  const [showAdd,      setShowAdd]      = useState(false);
  const [editTarget,   setEditTarget]   = useState<UserInvoice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserInvoice | null>(null);

  const filtered = filter === "All" ? invoices : invoices.filter((i) => i.status === filter);

  const handleAdd  = (data: Omit<UserInvoice, "id">) => {
    setInvoices((prev) => [{ id: genId("INV", prev), ...data }, ...prev]);
    setShowAdd(false);
  };
  const handleEdit = (data: Omit<UserInvoice, "id">) => {
    if (!editTarget) return;
    setInvoices((prev) => prev.map((i) => i.id === editTarget.id ? { ...i, ...data } : i));
    setEditTarget(null);
  };
  const handlePay = (id: string) =>
    setInvoices((prev) => prev.map((i) => i.id === id ? { ...i, status: "Paid" as InvoiceStatus } : i));
  const handleDelete = () => {
    if (!deleteTarget) return;
    setInvoices((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total",   val: String(invoices.length),                                                                color: "text-blue-700 bg-blue-50 border-blue-200"         },
          { label: "Pending", val: fmt(invoices.filter((i) => i.status === "Pending").reduce((s, i) => s + i.amount, 0)), color: "text-amber-700 bg-amber-50 border-amber-200"       },
          { label: "Overdue", val: fmt(invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0)), color: "text-red-700 bg-red-50 border-red-200"             },
          { label: "Paid",    val: fmt(invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0)),    color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 border ${s.color}`}>
            <div className="text-xs font-bold uppercase tracking-wider mb-2 opacity-70">{s.label}</div>
            <div className="text-xl font-extrabold">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex gap-2 flex-wrap items-center">
          {["All", "Paid", "Sent", "Overdue", "Pending"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 border border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >{f}</button>
          ))}
          <button onClick={() => setShowAdd(true)} className="ml-auto px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all">
            + New Invoice
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead><tr>{["Invoice #", "Customer", "Date", "Amount", "Status", "Actions"].map((h) => <TH key={h}>{h}</TH>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-sm">No invoices found</td></tr>
              )}
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-bold text-blue-600">{inv.id}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-800">{inv.customer}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{inv.date}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">{fmt(inv.amount)}</td>
                  <td className="px-4 py-3"><Badge status={inv.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {inv.status !== "Paid" && (
                        <button onClick={() => handlePay(inv.id)} className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all">Pay</button>
                      )}
                      <button onClick={() => setEditTarget(inv)} className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-all">Edit</button>
                      <button onClick={() => setDeleteTarget(inv)} className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd      && <InvoiceModal onSave={handleAdd} onClose={() => setShowAdd(false)} />}
      {editTarget   && <InvoiceModal initial={editTarget} onSave={handleEdit} onClose={() => setEditTarget(null)} />}
      {deleteTarget && <ConfirmDelete label={`${deleteTarget.id} – ${deleteTarget.customer}`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Expenses — CRUD
───────────────────────────────────────────── */
function UserExpenses({ expenses, setExpenses }: {
  expenses:    Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}) {
  const [filter,       setFilter]       = useState("All");
  const [showAdd,      setShowAdd]      = useState(false);
  const [editTarget,   setEditTarget]   = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);

  const filtered = filter === "All" ? expenses : expenses.filter((e) => e.status === filter);

  const handleAdd  = (data: Omit<Expense, "id">) => {
    setExpenses((prev) => [{ id: genId("EXP", prev), ...data }, ...prev]);
    setShowAdd(false);
  };
  const handleEdit = (data: Omit<Expense, "id">) => {
    if (!editTarget) return;
    setExpenses((prev) => prev.map((e) => e.id === editTarget.id ? { ...e, ...data } : e));
    setEditTarget(null);
  };
  const handlePay = (id: string) =>
    setExpenses((prev) => prev.map((e) => e.id === id ? { ...e, status: "Paid" as ExpenseStatus } : e));
  const handleDelete = () => {
    if (!deleteTarget) return;
    setExpenses((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { l: "Total",      v: fmt(expenses.reduce((s, e) => s + e.amount, 0)),               c: "text-slate-800",   bg: "bg-slate-50 border-slate-200"       },
          { l: "Paid",       v: `${expenses.filter((e) => e.status === "Paid").length} items`,    c: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200"   },
          { l: "Pending",    v: `${expenses.filter((e) => e.status === "Pending").length} items`, c: "text-amber-700",   bg: "bg-amber-50 border-amber-200"       },
          { l: "Categories", v: `${new Set(expenses.map((e) => e.category)).size}`,              c: "text-blue-700",    bg: "bg-blue-50 border-blue-200"         },
        ].map((s) => (
          <div key={s.l} className={`rounded-xl p-4 border ${s.bg}`}>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{s.l}</div>
            <div className={`text-xl font-extrabold ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex gap-2 flex-wrap items-center">
          {["All", "Paid", "Pending"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 border border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >{f}</button>
          ))}
          <button onClick={() => setShowAdd(true)} className="ml-auto px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all">
            + Add Expense
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead><tr>{["ID", "Category", "Vendor", "Date", "Amount", "Status", "Actions"].map((h) => <TH key={h}>{h}</TH>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-sm">No expenses found</td></tr>
              )}
              {filtered.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-bold text-violet-600">{exp.id}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-800">{exp.category}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{exp.vendor}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{exp.date}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">{fmt(exp.amount)}</td>
                  <td className="px-4 py-3"><Badge status={exp.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {exp.status !== "Paid" && (
                        <button onClick={() => handlePay(exp.id)} className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all">Pay</button>
                      )}
                      <button onClick={() => setEditTarget(exp)} className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-all">Edit</button>
                      <button onClick={() => setDeleteTarget(exp)} className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd      && <ExpenseModal onSave={handleAdd} onClose={() => setShowAdd(false)} />}
      {editTarget   && <ExpenseModal initial={editTarget} onSave={handleEdit} onClose={() => setEditTarget(null)} />}
      {deleteTarget && <ConfirmDelete label={`${deleteTarget.id} – ${deleteTarget.category}`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}

/* ─────────────────────────────────────────────
   GST Filing
───────────────────────────────────────────── */
function UserGST({ filings }: { filings: GSTFiling[] }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4 flex items-center gap-3 bg-amber-50 border border-amber-200">
        <AlertIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-amber-800 font-bold text-sm">GSTR-3B due April 20, 2024</p>
          <p className="text-amber-600 text-xs mt-0.5">Net liability ₹68,931 · Penalty ₹50/day if late</p>
        </div>
        <button className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all">File Now</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          ["Output GST", "₹80,037", "text-red-700",     "bg-red-50 border-red-200",      "📤"],
          ["Input ITC",  "₹11,106", "text-emerald-700", "bg-emerald-50 border-emerald-200","📥"],
          ["Net Payable","₹68,931", "text-amber-700",   "bg-amber-50 border-amber-200",   "💳"],
        ].map(([l, v, c, bg, ico]) => (
          <div key={l} className={`rounded-xl p-4 border ${bg} text-center`}>
            <div className="text-2xl mb-2">{ico}</div>
            <div className={`text-xl font-extrabold ${c}`}>{v}</div>
            <div className="text-xs text-slate-500 mt-1">{l}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-slate-800 font-bold text-sm">GST Return History</h3>
        </div>
        {filings.map((r, i) => (
          <div key={i} className="px-5 py-3.5 flex items-center justify-between border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
            <div>
              <span className="text-blue-600 font-bold text-sm">{r.form}</span>
              <span className="text-slate-400 text-xs ml-2">{r.period}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Due {r.due}</span>
              <Badge status={r.status} />
              <button className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-slate-300 transition-all">
                {r.status === "Paid" ? "View" : "File"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Activity
───────────────────────────────────────────── */
function UserActivity({ user, activities }: { user: AuthUser; activities: Activity[] }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-slate-800 font-bold text-sm">Recent Activity — {user.name}</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {activities.map((a, i) => (
            <div key={i} className="px-5 py-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors">
              <span className="text-lg mt-0.5">{a.icon}</span>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${a.color}`}>{a.text}</p>
                <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Root Export
───────────────────────────────────────────── */
export default function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const [page,      setPage]      = useState<UserPage>("dashboard");
  const [invoices,  setInvoices]  = useState<UserInvoice[]>(SEED_INVOICES);
  const [expenses,  setExpenses]  = useState<Expense[]>(SEED_EXPENSES);
  const [filings]                 = useState<GSTFiling[]>(SEED_GST);
  const [activities]              = useState<Activity[]>(SEED_ACTIVITIES);

  return (
    <DashboardLayout
      navItems={NAV_ITEMS}
      page={page}
      setPage={(id) => setPage(id as UserPage)}
      user={user}
      onLogout={onLogout}
      title={PAGE_TITLES[page]}
    >
      {page === "dashboard" && <UserOverview  user={user} invoices={invoices} expenses={expenses} />}
      {page === "invoices"  && <UserInvoices  invoices={invoices}  setInvoices={setInvoices}  />}
      {page === "expenses"  && <UserExpenses  expenses={expenses}  setExpenses={setExpenses}  />}
      {page === "gst"       && <UserGST       filings={filings}                               />}
      {page === "activity"  && <UserActivity  user={user}          activities={activities}    />}
    </DashboardLayout>
  );
}
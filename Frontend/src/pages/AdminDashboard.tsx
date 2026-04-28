import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { AuthUser, AdminPage } from "../types";
import { fmt } from "../constants/data";
import {
  adminStore,
  addInvoice, updateInvoice, payInvoice, deleteInvoice,
  addUser, updateUser, toggleUserStatus, deleteUser,
} from "../store/invoiceSlice";
import type { Invoice, AppUser, InvoiceStatus, UserRole, UserStatus } from "../store/invoiceSlice";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import {
  HomeIcon, InvoiceIcon, UsersIcon, ChartIcon, SettingsIcon,
  DollarIcon, AlertIcon, TrendingIcon,
} from "../components/Icons";

/* ─────────────────────────────────────────────
   Redux store state hook
───────────────────────────────────────────── */
function useAdminStore() {
  const [state, setState] = useState(adminStore.getState());
  useEffect(() => {
    const unsub = adminStore.subscribe(() => setState(adminStore.getState()));
    return unsub;
  }, []);
  return state;
}

/* ─────────────────────────────────────────────
   Nav + Page titles
───────────────────────────────────────────── */
interface AdminDashboardProps { user: AuthUser; onLogout: () => void; }

const NAV_ITEMS = [
  { id: "overview",  label: "Overview",  icon: HomeIcon     },
  { id: "invoices",  label: "Invoices",  icon: InvoiceIcon  },
  { id: "users",     label: "Users",     icon: UsersIcon    },
  { id: "reports",   label: "Reports",   icon: ChartIcon    },
  { id: "settings",  label: "Settings",  icon: SettingsIcon },
];

const PAGE_TITLES: Record<AdminPage, string> = {
  overview: "Admin Overview",
  invoices: "Invoices",
  users:    "User Management",
  reports:  "Reports",
  settings: "Settings",
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

const inputCls = "w-full px-3 py-2.5 rounded-xl text-sm text-slate-800 outline-none border border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all";
const errCls   = "text-red-500 text-xs font-medium mt-1";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
      {children}
      {error && <p className={errCls}>{error}</p>}
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
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all text-lg">×</button>
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
        <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-all">Delete</button>
      </div>
    </Modal>
  );
}

/* ─────────────────────────────────────────────
   Invoice Modal — React Hook Form
───────────────────────────────────────────── */
interface InvoiceFormValues {
  vendor: string;
  date:   string;
  amount: number;
  status: InvoiceStatus;
}

function InvoiceModal({ initial, onClose }: {
  initial?: Invoice; onClose: () => void;
}) {
  const isEdit = !!initial;

  const { register, handleSubmit, formState: { errors } } = useForm<InvoiceFormValues>({
    defaultValues: {
      vendor: initial?.vendor ?? "",
      date:   initial?.date   ?? new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      amount: initial?.amount ?? (0 as number),
      status: initial?.status ?? "Pending",
    },
  });

  const onSubmit = (data: InvoiceFormValues) => {
    if (isEdit && initial) {
      
      adminStore.dispatch(updateInvoice({ id: initial.id, ...data, amount: Number(data.amount) }));
    } else {
      
      adminStore.dispatch(addInvoice({ ...data, amount: Number(data.amount) }));
    }
    onClose();
  };

  return (
    <Modal title={isEdit ? "Edit Invoice" : "New Invoice"} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <Field label="Vendor" error={errors.vendor?.message}>
          <input
            {...register("vendor", { required: "Vendor" })}
            className={inputCls}
            placeholder="e.g. AWS India"
          />
        </Field>

        <Field label="Date" error={errors.date?.message}>
          <input
            {...register("date", { required: "Date" })}
            className={inputCls}
            placeholder="e.g. Apr 16"
          />
        </Field>

        <Field label="Amount (₹)" error={errors.amount?.message}>
          <input
            {...register("amount", {
              required:         "Amount",
              min: { value: 1, message: "0" },
              valueAsNumber: true,
            })}
            type="number"
            className={inputCls}
            placeholder="e.g. 12500"
          />
        </Field>

        <Field label="Status">
          <select {...register("status")} className={inputCls}>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </Field>

        <div className="flex gap-3 justify-end pt-1">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all">
            {isEdit ? "Save Changes" : "Create Invoice"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ─────────────────────────────────────────────
   User Modal — React Hook Form
───────────────────────────────────────────── */
interface UserFormValues {
  name:   string;
  email:  string;
  role:   UserRole;
  status: UserStatus;
}

function UserModal({ initial, onClose }: {
  initial?: AppUser; onClose: () => void;
}) {
  const isEdit = !!initial;

  const { register, handleSubmit, formState: { errors } } = useForm<UserFormValues>({
    defaultValues: {
      name:   initial?.name   ?? "",
      email:  initial?.email  ?? "",
      role:   initial?.role   ?? "User",
      status: initial?.status ?? "Active",
    },
  });

  const onSubmit = (data: UserFormValues) => {
    if (isEdit && initial) {
      
      adminStore.dispatch(updateUser({ id: initial.id, joined: initial.joined, ...data }));
    } else {
    
      adminStore.dispatch(addUser(data));
    }
    onClose();
  };

  return (
    <Modal title={isEdit ? "Edit User" : "Add User"} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <Field label="Full Name" error={errors.name?.message}>
          <input
            {...register("name", { required: "" })}
            className={inputCls}
            placeholder="e.g. Priya Sharma"
          />
        </Field>

        <Field label="Email" error={errors.email?.message}>
          <input
            {...register("email", {
              required: "Email",
              pattern:  { value: /\S+@\S+\.\S+/, message: " email" },
            })}
            type="email"
            className={inputCls}
            placeholder="e.g. priya@nexus.in"
          />
        </Field>

        <Field label="Role">
          <select {...register("role")} className={inputCls}>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </Field>

        <Field label="Status">
          <select {...register("status")} className={inputCls}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </Field>

        <div className="flex gap-3 justify-end pt-1">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all">
            {isEdit ? "Save Changes" : "Add User"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ─────────────────────────────────────────────
   Overview
───────────────────────────────────────────── */
function AdminOverview({ invoices, users }: { invoices: Invoice[]; users: AppUser[] }) {
  const totalRev = invoices.reduce((s, i) => s + i.amount, 0);
  return (
    <div className="space-y-6">
      <div className="rounded-xl p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
        <h2 className="font-bold text-lg">Welcome back, Admin! 👋</h2>
        <p className="text-blue-100 text-sm mt-1">
          GST return due in <span className="text-yellow-300 font-semibold">21 days</span> · Books are open.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<DollarIcon className="w-5 h-5" />}  label="Total Amount"  value={fmt(totalRev)}                                                                          sub="All invoices"      accent="blue"   />
        <StatCard icon={<UsersIcon className="w-5 h-5" />}   label="Active Users"  value={String(users.filter((u) => u.status === "Active").length)}                              sub={`${users.length} total`} accent="violet" />
        <StatCard icon={<InvoiceIcon className="w-5 h-5" />} label="Open Invoices" value={String(invoices.filter((i) => i.status !== "Paid").length)}                             sub="Pending + Overdue" accent="amber"  />
        <StatCard icon={<AlertIcon className="w-5 h-5" />}   label="Overdue"       value={fmt(invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0))} sub="Needs attention"   accent="red"    />
      </div>

      <div className="rounded-xl p-4 flex items-center gap-3 bg-amber-50 border border-amber-200">
        <AlertIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-amber-800 font-bold text-sm">GSTR-3B due April 20, 2024</p>
          <p className="text-amber-600 text-xs mt-0.5">Total liability ₹41,792 · Penalty ₹50/day if late</p>
        </div>
        <button className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all">File Now</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-slate-800 font-bold text-sm">Recent Invoices</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {invoices.slice(0, 5).map((inv) => (
            <div key={inv.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <div className="text-slate-800 text-sm font-semibold">{inv.vendor}</div>
                <div className="text-slate-400 text-xs">{inv.id} · {inv.date}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-800 font-bold text-sm">{fmt(inv.amount)}</span>
                <Badge status={inv.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-slate-800 font-bold text-sm mb-4">GST Summary — Mar 2024</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            ["IGST",  "₹24,892", "text-blue-700",   "bg-blue-50 border-blue-200"    ],
            ["CGST",  "₹8,450",  "text-teal-700",   "bg-teal-50 border-teal-200"    ],
            ["SGST",  "₹8,450",  "text-violet-700", "bg-violet-50 border-violet-200"],
            ["Total", "₹41,792", "text-red-700",    "bg-red-50 border-red-200"      ],
          ].map(([l, v, c, bg]) => (
            <div key={l} className={`text-center py-3 rounded-xl border ${bg}`}>
              <div className="text-xs text-slate-500 font-bold uppercase mb-1">{l}</div>
              <div className={`text-sm font-extrabold ${c}`}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Invoices — CRUD + Redux
───────────────────────────────────────────── */
function AdminInvoices({ invoices }: { invoices: Invoice[] }) {
  const [filter,       setFilter]       = useState("All");
  const [showAdd,      setShowAdd]      = useState(false);
  const [editTarget,   setEditTarget]   = useState<Invoice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);

  const filtered = filter === "All" ? invoices : invoices.filter((i) => i.status === filter);

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
          {["All", "Pending", "Paid", "Overdue"].map((f) => (
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
            <thead>
              <tr>{["Invoice #", "Vendor", "Date", "Amount", "Status", "Actions"].map((h) => <TH key={h}>{h}</TH>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-sm">No invoices found</td></tr>
              )}
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-bold text-blue-600">{inv.id}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-800">{inv.vendor}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{inv.date}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">{fmt(inv.amount)}</td>
                  <td className="px-4 py-3"><Badge status={inv.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {inv.status !== "Paid" && (
                        <button
                          onClick={() => adminStore.dispatch(payInvoice(inv.id))}
                          className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all"
                        >Pay</button>
                      )}
                      <button onClick={() => setEditTarget(inv)} className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-all">
                        Edit
                      </button>
                      <button onClick={() => setDeleteTarget(inv)} className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAdd      && <InvoiceModal onClose={() => setShowAdd(false)} />}
      {editTarget   && <InvoiceModal initial={editTarget} onClose={() => setEditTarget(null)} />}
      {deleteTarget && (
        <ConfirmDelete
          label={`${deleteTarget.id} – ${deleteTarget.vendor}`}
          onConfirm={() => { adminStore.dispatch(deleteInvoice(deleteTarget.id)); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Users — CRUD + Redux
───────────────────────────────────────────── */
function AdminUsers({ users }: { users: AppUser[] }) {
  const [showAdd,      setShowAdd]      = useState(false);
  const [editTarget,   setEditTarget]   = useState<AppUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-slate-800 font-bold">All Users</h3>
          <p className="text-slate-400 text-xs">{users.length} total · {users.filter((u) => u.status === "Active").length} active</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all">
          + Add User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {users.length === 0 && <p className="px-5 py-8 text-center text-slate-400 text-sm">No users found</p>}
        <div className="divide-y divide-slate-100">
          {users.map((u) => (
            <div key={u.id} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {u.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-slate-800 font-semibold text-sm">{u.name}</div>
                <div className="text-slate-400 text-xs">{u.email}</div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Badge status={u.role} />
                <Badge status={u.status} />
              </div>
              <div className="text-xs text-slate-400 hidden md:block">{u.joined}</div>
              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => adminStore.dispatch(toggleUserStatus(u.id))}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
                    u.status === "Active"
                      ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  }`}
                >{u.status === "Active" ? "Deactivate" : "Activate"}</button>
                <button onClick={() => setEditTarget(u)} className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-slate-300 transition-all">Edit</button>
                <button onClick={() => setDeleteTarget(u)} className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAdd      && <UserModal onClose={() => setShowAdd(false)} />}
      {editTarget   && <UserModal initial={editTarget} onClose={() => setEditTarget(null)} />}
      {deleteTarget && (
        <ConfirmDelete
          label={deleteTarget.name}
          onConfirm={() => { adminStore.dispatch(deleteUser(deleteTarget.id)); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Reports
───────────────────────────────────────────── */
function AdminReports({ invoices }: { invoices: Invoice[] }) {
  const revenue  = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const expenses = invoices.reduce((s, i) => s + i.amount, 0);
  const net      = revenue - expenses * 0.3;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Revenue",  val: fmt(revenue),  delta: "+12%", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
          { label: "Expenses", val: fmt(expenses), delta: "+3%",  color: "text-amber-700",   bg: "bg-amber-50 border-amber-200"     },
          { label: "Net P&L",  val: fmt(net),      delta: "+18%", color: "text-blue-700",    bg: "bg-blue-50 border-blue-200"       },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-5 border ${s.bg}`}>
            <div className="text-xs text-slate-500 font-bold uppercase mb-2">{s.label}</div>
            <div className={`text-2xl font-extrabold ${s.color}`}>{s.val}</div>
            <div className="flex items-center gap-1 mt-1 text-emerald-600 text-xs font-semibold">
              <TrendingIcon className="w-4 h-4" /> {s.delta} vs last month
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-slate-800 font-bold mb-4">Monthly Revenue Trend</h3>
        <div className="flex items-end gap-2 h-32">
          {[45, 60, 48, 72, 55, 80, 68, 90, 75, 88, 95, 102].map((v, i) => (
            <div key={i} className={`flex-1 rounded-t transition-all cursor-pointer ${i === 11 ? "bg-blue-600" : "bg-blue-200 hover:bg-blue-300"}`}
              style={{ height: `${(v / 102) * 100}%` }} />
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          {["Apr", "Jun", "Aug", "Oct", "Dec", "Mar"].map((m) => <span key={m}>{m}</span>)}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Settings
───────────────────────────────────────────── */
function AdminSettings({ user }: { user: AuthUser }) {
  return (
    <div className="space-y-4 max-w-xl">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-slate-800 font-bold mb-4">Company Info</h3>
        <div className="space-y-3">
          {[
            ["Company Name", "Nexus Technologies Pvt Ltd"],
            ["GSTIN",        "29AABCN1234A1Z5"           ],
            ["PAN",          "AABCN1234A"                 ],
            ["Fiscal Year",  "April 1"                    ],
          ].map(([l, v]) => (
            <div key={l}>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{l}</label>
              <input defaultValue={v} className={inputCls} />
            </div>
          ))}
        </div>
        <button className="mt-4 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all">Save Changes</button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-slate-800 font-bold mb-1">Logged in as</h3>
        <p className="text-slate-500 text-sm">{user.name} · <span className="text-blue-600 font-medium">{user.email}</span></p>
        <div className="mt-3"><Badge status={user.role} /></div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Root Export
───────────────────────────────────────────── */
export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [page, setPage] = useState<AdminPage>("overview");


  const { invoices, users } = useAdminStore();

  return (
    <DashboardLayout
      navItems={NAV_ITEMS}
      page={page}
      setPage={(id) => setPage(id as AdminPage)}
      user={user}
      onLogout={onLogout}
      title={PAGE_TITLES[page]}
    >
      {page === "overview" && <AdminOverview invoices={invoices} users={users} />}
      {page === "invoices" && <AdminInvoices invoices={invoices} />}
      {page === "users"    && <AdminUsers    users={users} />}
      {page === "reports"  && <AdminReports  invoices={invoices} />}
      {page === "settings" && <AdminSettings user={user} />}
    </DashboardLayout>
  );
}
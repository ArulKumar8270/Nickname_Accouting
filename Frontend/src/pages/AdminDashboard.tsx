import { useState } from "react";
import type { AuthUser, AdminPage } from "../types";
import { INVOICES, USERS_LIST, fmt } from "../constants/data";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import {
  HomeIcon, InvoiceIcon, UsersIcon, ChartIcon, SettingsIcon,
  DollarIcon, AlertIcon, TrendingIcon,
} from "../components/Icons";

interface AdminDashboardProps {
  user: AuthUser;
  onLogout: () => void;
}

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

/* ── Shared table header cell ── */
function TH({ children }: { children: string }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
      {children}
    </th>
  );
}

/* ── Overview ── */
function AdminOverview() {
  return (
    <div className="space-y-6">

      {/* Welcome banner */}
      <div className="rounded-xl p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-lg">Welcome back, Admin! 👋</h2>
            <p className="text-blue-100 text-sm mt-1">
              GST return due in <span className="text-yellow-300 font-semibold">21 days</span> · Mar 2024 books are open.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg text-xs font-bold bg-white/20 hover:bg-white/30 border border-white/30 transition-all">
              + New Invoice
            </button>
            <button className="px-4 py-2 rounded-lg text-xs font-bold bg-white text-blue-600 hover:bg-blue-50 transition-all">
              + Add User
            </button>
          </div>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<DollarIcon className="w-5 h-5" />}  label="Total Revenue"  value="₹6,44,650" sub="This month"     accent="blue"    />
        <StatCard icon={<UsersIcon className="w-5 h-5" />}   label="Active Users"   value="3"          sub="1 inactive"    accent="violet"  />
        <StatCard icon={<InvoiceIcon className="w-5 h-5" />} label="Open Invoices"  value="5"          sub="₹1,83,400 due" accent="amber"   />
        <StatCard icon={<ChartIcon className="w-5 h-5" />}   label="GST Payable"    value="₹41,792"    sub="Due Apr 20"    accent="red"     />
      </div>

      {/* GST alert */}
      <div className="rounded-xl p-4 flex items-center gap-3 bg-amber-50 border border-amber-200">
        <AlertIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-amber-800 font-bold text-sm">GSTR-3B due April 20, 2024</p>
          <p className="text-amber-600 text-xs mt-0.5">Total liability ₹41,792 · Penalty ₹50/day if late</p>
        </div>
        <button className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all">
          File Now
        </button>
      </div>

      {/* Recent invoices */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-slate-800 font-bold text-sm">Recent Invoices</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {INVOICES.map((inv, i) => (
            <div key={i} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
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

      {/* GST summary boxes */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-slate-800 font-bold text-sm mb-4">GST Summary — Mar 2024</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            ["IGST",  "₹24,892", "text-blue-700",    "bg-blue-50 border-blue-200"   ],
            ["CGST",  "₹8,450",  "text-teal-700",    "bg-teal-50 border-teal-200"   ],
            ["SGST",  "₹8,450",  "text-violet-700",  "bg-violet-50 border-violet-200"],
            ["Total", "₹41,792", "text-red-700",     "bg-red-50 border-red-200"     ],
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

/* ── Invoices ── */
function AdminInvoices() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? INVOICES : INVOICES.filter((i) => i.status === filter);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total",   val: String(INVOICES.length),                                                                    color: "text-blue-700 bg-blue-50 border-blue-200"    },
          { label: "Pending", val: fmt(INVOICES.filter((i) => i.status === "Pending").reduce((s, i) => s + i.amount, 0)),      color: "text-amber-700 bg-amber-50 border-amber-200"  },
          { label: "Overdue", val: fmt(INVOICES.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0)),      color: "text-red-700 bg-red-50 border-red-200"        },
          { label: "Paid",    val: fmt(INVOICES.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0)),         color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
        ].map((s, i) => (
          <div key={i} className={`rounded-xl p-4 border ${s.color}`}>
            <div className="text-xs font-bold uppercase tracking-wider mb-2 opacity-70">{s.label}</div>
            <div className="text-xl font-extrabold">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex gap-2 flex-wrap items-center">
          {["All", "Pending", "Paid", "Overdue"].map((f) => (
            <button
              key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 border border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >{f}</button>
          ))}
          <button className="ml-auto px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all">
            + New
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px]">
            <thead>
              <tr>{["Invoice #", "Vendor", "Date", "Amount", "Status", "Action"].map((h) => <TH key={h}>{h}</TH>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inv, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-bold text-blue-600">{inv.id}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-800">{inv.vendor}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{inv.date}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">{fmt(inv.amount)}</td>
                  <td className="px-4 py-3"><Badge status={inv.status} /></td>
                  <td className="px-4 py-3">
                    <button className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-all">
                      Pay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Users ── */
function AdminUsers() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-slate-800 font-bold">All Users</h3>
          <p className="text-slate-400 text-xs">
            {USERS_LIST.length} total · {USERS_LIST.filter((u) => u.status === "Active").length} active
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all">
          + Add User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {USERS_LIST.map((u, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
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
              <div className="flex gap-2">
                <button className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-slate-300 transition-all">
                  Edit
                </button>
                <button className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Reports ── */
function AdminReports() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Revenue",  val: "₹6,44,650", delta: "+12%", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
          { label: "Expenses", val: "₹1,55,900", delta: "+3%",  color: "text-amber-700",   bg: "bg-amber-50 border-amber-200"     },
          { label: "Net P&L",  val: "₹4,88,750", delta: "+18%", color: "text-blue-700",    bg: "bg-blue-50 border-blue-200"       },
        ].map((s, i) => (
          <div key={i} className={`rounded-xl p-5 border ${s.bg}`}>
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
            <div
              key={i}
              className={`flex-1 rounded-t transition-all cursor-pointer ${
                i === 11 ? "bg-blue-600" : "bg-blue-200 hover:bg-blue-300"
              }`}
              style={{ height: `${(v / 102) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          {["Apr", "Jun", "Aug", "Oct", "Dec", "Mar"].map((m) => <span key={m}>{m}</span>)}
        </div>
      </div>
    </div>
  );
}

/* ── Settings ── */
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
              <input
                defaultValue={v}
                className="w-full px-3 py-2.5 rounded-xl text-sm text-slate-800 outline-none border border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              />
            </div>
          ))}
        </div>
        <button className="mt-4 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all">
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-slate-800 font-bold mb-1">Logged in as</h3>
        <p className="text-slate-500 text-sm">
          {user.name} · <span className="text-blue-600 font-medium">{user.email}</span>
        </p>
        <div className="mt-3"><Badge status={user.role} /></div>
      </div>
    </div>
  );
}

/* ── Root Export ── */
export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [page, setPage] = useState<AdminPage>("overview");

  return (
    <DashboardLayout
      navItems={NAV_ITEMS}
      page={page}
      setPage={(id) => setPage(id as AdminPage)}
      user={user}
      onLogout={onLogout}
      title={PAGE_TITLES[page]}
    >
      {page === "overview" && <AdminOverview />}
      {page === "invoices" && <AdminInvoices />}
      {page === "users"    && <AdminUsers />}
      {page === "reports"  && <AdminReports />}
      {page === "settings" && <AdminSettings user={user} />}
    </DashboardLayout>
  );
}
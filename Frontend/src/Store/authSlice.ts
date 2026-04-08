import { useState } from "react";
import type { AuthUser, UserPage } from "../types";
import { USER_INVOICES, EXPENSES, GST_FILINGS, ACTIVITIES, fmt } from "../constants/data";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import {
  HomeIcon, InvoiceIcon, DollarIcon, ShieldIcon, ActivityIcon, AlertIcon,
} from "../components/Icons";


interface UserDashboardProps {
  user: AuthUser;
  onLogout: () => void;
}

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

/* ── Shared table header ── */
function TH({ children }: { children: string }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
      {children}
    </th>
  );
}

/* ── Dashboard Overview ── */
function UserOverview({ user }: { user: AuthUser }) {
  return (
    <div className="space-y-6">

      {/* Welcome */}
      <div className="rounded-xl p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-lg">Hello, {user.name.split(" ")[0]}! 👋</h2>
            <p className="text-blue-100 text-sm mt-1">
              GST return due in <span className="text-yellow-300 font-semibold">21 days</span> · Mar 2024 is open.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg text-xs font-bold bg-white/20 hover:bg-white/30 border border-white/30 transition-all">
              + Expense
            </button>
            <button className="px-4 py-2 rounded-lg text-xs font-bold bg-white text-blue-600 hover:bg-blue-50 transition-all">
              + Invoice
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<InvoiceIcon className="w-5 h-5" />}  label="Total Invoiced" value="₹6,44,650" sub="7 invoices"  accent="blue"   />
        <StatCard icon={<DollarIcon className="w-5 h-5" />}   label="Total Expenses" value="₹1,55,900" sub="6 expenses"  accent="amber"  />
        <StatCard icon={<ShieldIcon className="w-5 h-5" />}   label="GST Payable"    value="₹68,931"   sub="Due Apr 20"  accent="red"    />
        <StatCard icon={<ActivityIcon className="w-5 h-5" />} label="Outstanding"    value="₹4,44,650" sub="3 unpaid"    accent="violet" />
      </div>

      {/* Recent + GST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent invoices */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-slate-800 font-bold text-sm">Recent Invoices</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {USER_INVOICES.slice(0, 4).map((inv, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <div className="text-slate-800 text-sm font-semibold">{inv.customer}</div>
                  <div className="text-slate-400 text-xs">{inv.id}</div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className="text-slate-800 text-sm font-bold">{fmt(inv.amount)}</span>
                  <Badge status={inv.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GST quick summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-slate-800 font-bold text-sm mb-4">GST Summary — Mar 2024</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Output GST", "₹80,037", "text-red-700",    "bg-red-50 border-red-200"       ],
              ["ITC Available","₹11,106","text-emerald-700","bg-emerald-50 border-emerald-200"],
              ["Net Payable", "₹68,931", "text-amber-700",  "bg-amber-50 border-amber-200"   ],
              ["Due Date",    "Apr 20",  "text-blue-700",   "bg-blue-50 border-blue-200"     ],
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

/* ── Invoices ── */
function UserInvoices() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? USER_INVOICES : USER_INVOICES.filter((i) => i.status === filter);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex gap-2 flex-wrap items-center">
          {["All", "Paid", "Sent", "Overdue", "Pending"].map((f) => (
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
          <table className="w-full min-w-[500px]">
            <thead>
              <tr>{["Invoice #", "Customer", "Date", "Amount", "Status"].map((h) => <TH key={h}>{h}</TH>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inv, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-bold text-blue-600">{inv.id}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-800">{inv.customer}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{inv.date}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">{fmt(inv.amount)}</td>
                  <td className="px-4 py-3"><Badge status={inv.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Expenses ── */
function UserExpenses() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { l: "Total",      v: fmt(EXPENSES.reduce((s, e) => s + e.amount, 0)),               c: "text-slate-800",    bg: "bg-slate-50 border-slate-200"       },
          { l: "Paid",       v: `${EXPENSES.filter((e) => e.status === "Paid").length} items`,    c: "text-emerald-700",  bg: "bg-emerald-50 border-emerald-200"   },
          { l: "Pending",    v: `${EXPENSES.filter((e) => e.status === "Pending").length} items`, c: "text-amber-700",    bg: "bg-amber-50 border-amber-200"       },
          { l: "Categories", v: "5",                                                             c: "text-blue-700",     bg: "bg-blue-50 border-blue-200"         },
        ].map((s, i) => (
          <div key={i} className={`rounded-xl p-4 border ${s.bg}`}>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{s.l}</div>
            <div className={`text-xl font-extrabold ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
          <span className="text-slate-800 font-bold text-sm">All Expenses</span>
          <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all">
            + Add
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {EXPENSES.map((exp, i) => (
            <div key={i} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <div className="text-slate-800 text-sm font-semibold">{exp.category}</div>
                <div className="text-slate-400 text-xs">{exp.vendor} · {exp.date}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-800 font-bold text-sm">{fmt(exp.amount)}</span>
                <Badge status={exp.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── GST Filing ── */
function UserGST() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4 flex items-center gap-3 bg-amber-50 border border-amber-200">
        <AlertIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-amber-800 font-bold text-sm">GSTR-3B due April 20, 2024</p>
          <p className="text-amber-600 text-xs mt-0.5">Net liability ₹68,931 · Penalty ₹50/day if late</p>
        </div>
        <button className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all">
          File Now
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          ["Output GST", "₹80,037", "text-red-700",    "bg-red-50 border-red-200",     "📤"],
          ["Input ITC",  "₹11,106", "text-emerald-700","bg-emerald-50 border-emerald-200","📥"],
          ["Net Payable","₹68,931", "text-amber-700",  "bg-amber-50 border-amber-200",  "💳"],
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
        {GST_FILINGS.map((r, i) => (
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

/* ── Activity ── */
function UserActivity({ user }: { user: AuthUser }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-slate-800 font-bold text-sm">Recent Activity — {user.name}</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {ACTIVITIES.map((a, i) => (
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

/* ── Root Export ── */
export default function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const [page, setPage] = useState<UserPage>("dashboard");

  return (
    <DashboardLayout
      navItems={NAV_ITEMS}
      page={page}
      setPage={(id) => setPage(id as UserPage)}
      user={user}
      onLogout={onLogout}
      title={PAGE_TITLES[page]}
    >
      {page === "dashboard" && <UserOverview user={user} />}
      {page === "invoices"  && <UserInvoices />}
      {page === "expenses"  && <UserExpenses />}
      {page === "gst"       && <UserGST />}
      {page === "activity"  && <UserActivity user={user} />}
    </DashboardLayout>
  );
}
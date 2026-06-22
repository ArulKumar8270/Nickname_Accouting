import { useState, useEffect } from "react";
import type { Invoice, AppUser, AuthUser } from "../../types";
import { invoiceApi, userApi } from "../../services/api";
import StatCard from "../../components/StatCard";
import Badge from "../../components/Badge";
import {
  DollarIcon, AlertIcon, UsersIcon, InvoiceIcon,
} from "../../components/Icons";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

interface OverviewPageProps {
  user: AuthUser;
}

export default function OverviewPage({ user }: OverviewPageProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [users,    setUsers]    = useState<AppUser[]>([]);

  useEffect(() => {
    // GET /api/invoices  +  GET /api/users  — both show in network tab
    Promise.all([invoiceApi.getAll(), userApi.getAll()])
      .then(([inv, usr]) => {
        setInvoices(inv);
        setUsers(usr);
      })
      .catch(console.error);
  }, []);

  const totalRev = invoices.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-xl p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
        <h2 className="font-bold text-lg">Welcome back, {user.name}! 👋</h2>
        <p className="text-blue-100 text-sm mt-1">
          GST return due in{" "}
          <span className="text-yellow-300 font-semibold">21 days</span> · Books are open.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<DollarIcon  className="w-5 h-5" />} label="Total Amount"  value={fmt(totalRev)}                                                                             sub="All invoices"      accent="blue"   />
        <StatCard icon={<UsersIcon   className="w-5 h-5" />} label="Active Users"  value={String(users.filter((u) => u.status === "Active").length)}                                sub={`${users.length} total`} accent="violet" />
        <StatCard icon={<InvoiceIcon className="w-5 h-5" />} label="Open Invoices" value={String(invoices.filter((i) => i.status !== "Paid").length)}                              sub="Pending + Overdue" accent="amber"  />
        <StatCard icon={<AlertIcon   className="w-5 h-5" />} label="Overdue"       value={fmt(invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0))}  sub="Needs attention"   accent="red"    />
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
          {invoices.slice(0, 5).map((inv) => (
            <div
              key={inv.id}
              className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
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
          {invoices.length === 0 && (
            <p className="px-5 py-6 text-center text-slate-400 text-sm">Loading...</p>
          )}
        </div>
      </div>

      {/* GST Summary */}
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
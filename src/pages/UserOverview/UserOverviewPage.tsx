import { useState, useEffect } from "react";
import type { UserInvoice, Expense } from "../../types/user";
import type { AuthUser } from "../../types";
import { userInvoiceApi, expenseApi } from "../../services/userApi";
import StatCard from "../../components/StatCard";
import Badge from "../../components/Badge";
import { InvoiceIcon, DollarIcon, ShieldIcon, ActivityIcon } from "../../components/Icons";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

interface UserOverviewPageProps {
  user: AuthUser;
}

export default function UserOverviewPage({ user }: UserOverviewPageProps) {
  const [invoices, setInvoices] = useState<UserInvoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    // GET /api/user/invoices  +  GET /api/user/expenses — both in network tab
    Promise.all([userInvoiceApi.getAll(), expenseApi.getAll()])
      .then(([inv, exp]) => {
        setInvoices(inv);
        setExpenses(exp);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-xl p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
        <h2 className="font-bold text-lg">Hello, {user.name.split(" ")[0]}! 👋</h2>
        <p className="text-blue-100 text-sm mt-1">
          GST return due in{" "}
          <span className="text-yellow-300 font-semibold">21 days</span> · Mar 2024 is open.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<InvoiceIcon  className="w-5 h-5" />} label="Total Invoiced" value={fmt(invoices.reduce((s, i) => s + i.amount, 0))}                                    sub={`${invoices.length} invoices`} accent="blue"   />
        <StatCard icon={<DollarIcon   className="w-5 h-5" />} label="Total Expenses" value={fmt(expenses.reduce((s, e) => s + e.amount, 0))}                                    sub={`${expenses.length} expenses`} accent="amber"  />
        <StatCard icon={<ShieldIcon   className="w-5 h-5" />} label="GST Payable"    value="₹68,931"                                                                             sub="Due Apr 20"                    accent="red"    />
        <StatCard icon={<ActivityIcon className="w-5 h-5" />} label="Outstanding"    value={fmt(invoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0))} sub="Unpaid"                        accent="violet" />
      </div>

      {/* Recent invoices + GST summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-slate-800 font-bold text-sm">Recent Invoices</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {invoices.length === 0 && (
              <p className="px-5 py-6 text-center text-slate-400 text-sm">Loading...</p>
            )}
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
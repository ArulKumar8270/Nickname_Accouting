import { useMemo } from "react";
import type { Invoice } from "../../types";
import { TrendingIcon } from "../../components/Icons";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

interface ReportsPageProps {
  invoices: Invoice[];
}

export default function ReportsPage({ invoices }: ReportsPageProps) {
  const revenue  = useMemo(() => invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0), [invoices]);
  const expenses = useMemo(() => invoices.reduce((s, i) => s + i.amount, 0), [invoices]);
  const net      = revenue - expenses * 0.3;

  return (
    <div className="space-y-4">
      {/* Summary cards */}
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

      {/* Bar chart */}
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
          {["Apr", "Jun", "Aug", "Oct", "Dec", "Mar"].map((m) => (
            <span key={m}>{m}</span>
          ))}
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
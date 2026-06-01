import { useState, useEffect, useCallback } from "react";
import type { Expense } from "../../types/user";
import { expenseApi } from "../../services/userApi";
import Badge from "../../components/Badge";
import ConfirmDeleteModal from "../../components/Modals/ConfirmDeleteModal";
import ExpenseFormModal from "./ExpenseFormModal";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function TH({ children }: { children: string }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
      {children}
    </th>
  );
}

export default function ExpensesPage() {
  const [expenses,     setExpenses]     = useState<Expense[]>([]);
  const [filter,       setFilter]       = useState("All");
  const [loading,      setLoading]      = useState(false);
  const [showAdd,      setShowAdd]      = useState(false);
  const [editTarget,   setEditTarget]   = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);

  /* ── GET /api/user/expenses ── */
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await expenseApi.getAll();
      setExpenses(data);
    } catch (err) {
      console.error("Fetch expenses failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  /* ── PATCH /api/user/expenses/:id/pay ── */
  const handlePay = async (id: string) => {
    try {
      await expenseApi.pay(id);
      fetchExpenses();
    } catch (err) {
      console.error("Pay failed:", err);
    }
  };

  /* ── DELETE /api/user/expenses/:id ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await expenseApi.remove(deleteTarget.id);
      setDeleteTarget(null);
      fetchExpenses();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const filtered =
    filter === "All" ? expenses : expenses.filter((e) => e.status === filter);

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { l: "Total",      v: fmt(expenses.reduce((s, e) => s + e.amount, 0)),                 c: "text-slate-800",   bg: "bg-slate-50 border-slate-200"     },
          { l: "Paid",       v: `${expenses.filter((e) => e.status === "Paid").length} items`,   c: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
          { l: "Pending",    v: `${expenses.filter((e) => e.status === "Pending").length} items`, c: "text-amber-700",  bg: "bg-amber-50 border-amber-200"     },
          { l: "Categories", v: `${new Set(expenses.map((e) => e.category)).size}`,              c: "text-blue-700",    bg: "bg-blue-50 border-blue-200"       },
        ].map((s) => (
          <div key={s.l} className={`rounded-xl p-4 border ${s.bg}`}>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{s.l}</div>
            <div className={`text-xl font-extrabold ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex gap-2 flex-wrap items-center">
          {["All", "Paid", "Pending"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 border border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >{f}</button>
          ))}
          <button onClick={() => setShowAdd(true)}
            className="ml-auto px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all">
            + Add Expense
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr>{["ID", "Category", "Vendor", "Date", "Amount", "Status", "Actions"].map((h) => <TH key={h}>{h}</TH>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-sm">Loading...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-sm">No expenses found</td></tr>
              )}
              {!loading && filtered.map((exp) => (
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
                        <button onClick={() => handlePay(exp.id)}
                          className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all">
                          Pay
                        </button>
                      )}
                      <button onClick={() => setEditTarget(exp)}
                        className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-all">
                        Edit
                      </button>
                      <button onClick={() => setDeleteTarget(exp)}
                        className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all">
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

      {showAdd      && <ExpenseFormModal onClose={() => setShowAdd(false)} onSuccess={fetchExpenses} />}
      {editTarget   && <ExpenseFormModal initial={editTarget} onClose={() => setEditTarget(null)} onSuccess={fetchExpenses} />}
      {deleteTarget && (
        <ConfirmDeleteModal
          label={`${deleteTarget.id} – ${deleteTarget.category}`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
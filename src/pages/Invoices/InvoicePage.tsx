import { useState, useEffect, useCallback } from "react";
import type { Invoice } from "../../types";
import { invoiceApi } from "../../services/api";
import Badge from "../../components/Badge";
import ConfirmDeleteModal from "../../components/Modals/ConfirmDeleteModal";
import InvoiceFormModal from "./InvoiceFormModal";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function TH({ children }: { children: string }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
      {children}
    </th>
  );
}

export default function InvoicePage() {
  const [invoices, setInvoices]     = useState<Invoice[]>([]);
  const [filter, setFilter]         = useState("All");
  const [loading, setLoading]       = useState(false);
  const [showAdd, setShowAdd]       = useState(false);
  const [editTarget, setEditTarget] = useState<Invoice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);

  /* ── GET all invoices ── */
  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await invoiceApi.getAll(); // GET /api/invoices
      setInvoices(data);
    } catch (err) {
      console.error("Fetch invoices failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  /* ── PATCH pay ── */
  const handlePay = async (id: string) => {
    try {
      await invoiceApi.pay(id); // PATCH /api/invoices/:id/pay
      fetchInvoices();
    } catch (err) {
      console.error("Pay failed:", err);
    }
  };

  /* ── DELETE ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await invoiceApi.remove(deleteTarget.id); // DELETE /api/invoices/:id
      setDeleteTarget(null);
      fetchInvoices();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const filtered =
    filter === "All" ? invoices : invoices.filter((i) => i.status === filter);

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total",   val: String(invoices.length),                                                                  color: "text-blue-700 bg-blue-50 border-blue-200"         },
          { label: "Pending", val: fmt(invoices.filter((i) => i.status === "Pending").reduce((s, i) => s + i.amount, 0)),    color: "text-amber-700 bg-amber-50 border-amber-200"       },
          { label: "Overdue", val: fmt(invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0)),    color: "text-red-700 bg-red-50 border-red-200"             },
          { label: "Paid",    val: fmt(invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0)),       color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 border ${s.color}`}>
            <div className="text-xs font-bold uppercase tracking-wider mb-2 opacity-70">{s.label}</div>
            <div className="text-xl font-extrabold">{s.val}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex gap-2 flex-wrap items-center">
          {["All", "Pending", "Paid", "Overdue"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 border border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              {f}
            </button>
          ))}
          <button
            onClick={() => setShowAdd(true)}
            className="ml-auto px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all"
          >
            + New Invoice
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                {["Invoice #", "Vendor", "Date", "Amount", "Status", "Actions"].map((h) => (
                  <TH key={h}>{h}</TH>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-sm">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-sm">
                    No invoices found
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-bold text-blue-600">{inv.id}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">{inv.vendor}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{inv.date}</td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-800">{fmt(inv.amount)}</td>
                    <td className="px-4 py-3">
                      <Badge status={inv.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {inv.status !== "Paid" && (
                          <button
                            onClick={() => handlePay(inv.id)}
                            className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all"
                          >
                            Pay
                          </button>
                        )}
                        <button
                          onClick={() => setEditTarget(inv)}
                          className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(inv)}
                          className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all"
                        >
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
      {showAdd && (
        <InvoiceFormModal
          onClose={() => setShowAdd(false)}
          onSuccess={fetchInvoices}
        />
      )}
      {editTarget && (
        <InvoiceFormModal
          initial={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={fetchInvoices}
        />
      )}
      {deleteTarget && (
        <ConfirmDeleteModal
          label={`${deleteTarget.id} – ${deleteTarget.vendor}`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
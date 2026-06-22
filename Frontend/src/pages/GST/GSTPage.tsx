import { useState, useEffect, useCallback } from "react";
import type { GSTFiling } from "../../types/user";
import { gstApi } from "../../services/userApi";
import Badge from "../../components/Badge";
import { AlertIcon } from "../../components/Icons";

export default function GSTPage() {
  const [filings, setFilings] = useState<GSTFiling[]>([]);
  const [loading, setLoading] = useState(false);
  const [filing,  setFiling]  = useState<string | null>(null); // tracks which form is being filed

  /* ── GET /api/user/gst ── */
  const fetchFilings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await gstApi.getFilings();
      setFilings(data);
    } catch (err) {
      console.error("Fetch GST filings failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFilings(); }, [fetchFilings]);

  /* ── POST /api/user/gst/file ── */
  const handleFile = async (form: string, period: string) => {
    setFiling(`${form}-${period}`);
    try {
      await gstApi.file(form, period);
      fetchFilings();
    } catch (err) {
      console.error("GST filing failed:", err);
    } finally {
      setFiling(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Alert banner */}
      <div className="rounded-xl p-4 flex items-center gap-3 bg-amber-50 border border-amber-200">
        <AlertIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-amber-800 font-bold text-sm">GSTR-3B due April 20, 2024</p>
          <p className="text-amber-600 text-xs mt-0.5">Net liability ₹68,931 · Penalty ₹50/day if late</p>
        </div>
        <button
          onClick={() => handleFile("GSTR-3B", "Mar 2024")}
          className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all"
        >
          File Now
        </button>
      </div>

      {/* GST summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          ["Output GST",  "₹80,037", "text-red-700",     "bg-red-50 border-red-200",        "📤"],
          ["Input ITC",   "₹11,106", "text-emerald-700", "bg-emerald-50 border-emerald-200", "📥"],
          ["Net Payable", "₹68,931", "text-amber-700",   "bg-amber-50 border-amber-200",     "💳"],
        ].map(([l, v, c, bg, ico]) => (
          <div key={l} className={`rounded-xl p-4 border ${bg} text-center`}>
            <div className="text-2xl mb-2">{ico}</div>
            <div className={`text-xl font-extrabold ${c}`}>{v}</div>
            <div className="text-xs text-slate-500 mt-1">{l}</div>
          </div>
        ))}
      </div>

      {/* Filing history */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-slate-800 font-bold text-sm">GST Return History</h3>
        </div>
        {loading && (
          <p className="px-5 py-8 text-center text-slate-400 text-sm">Loading...</p>
        )}
        {!loading && filings.map((r, i) => (
          <div
            key={i}
            className="px-5 py-3.5 flex items-center justify-between border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
          >
            <div>
              <span className="text-blue-600 font-bold text-sm">{r.form}</span>
              <span className="text-slate-400 text-xs ml-2">{r.period}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Due {r.due}</span>
              <Badge status={r.status} />
              <button
                disabled={filing === `${r.form}-${r.period}`}
                onClick={() => r.status !== "Paid" && handleFile(r.form, r.period)}
                className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-slate-300 disabled:opacity-50 transition-all"
              >
                {filing === `${r.form}-${r.period}` ? "Filing..." : r.status === "Paid" ? "View" : "File"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
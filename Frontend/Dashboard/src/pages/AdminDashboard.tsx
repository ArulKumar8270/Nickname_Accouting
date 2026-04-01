import { useState, useEffect } from "react";

// ─── Responsive hook ─────────────────────────────────────────────────────────
function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024, w };
}

// ─── Color tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#f5f7fa", sidebar: "#ffffff", card: "#ffffff",
  border: "#e8ecf0", borderLight: "#f0f3f6",
  text: "#1a2332", muted: "#6b7a8d", faint: "#a8b4c0",
  primary: "#2563eb", primaryLight: "#eff4ff", primaryBorder: "#bfccfd",
  green: "#16a34a", greenBg: "#f0fdf4", greenBorder: "#86efac",
  red: "#dc2626", redBg: "#fff5f5", redBorder: "#fca5a5",
  amber: "#d97706", amberBg: "#fffbeb", amberBorder: "#fcd34d",
  purple: "#7c3aed", purpleBg: "#f5f3ff",
  teal: "#0d9488", tealBg: "#f0fdfa",
};

const card = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px" };

const badge = (color, bg, border) => ({
  fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
  color, background: bg, border: `1px solid ${border}`, whiteSpace: "nowrap", display: "inline-block",
});

const btn = (variant = "primary", small = false) => ({
  padding: small ? "6px 12px" : "8px 16px", borderRadius: 7,
  fontSize: small ? 11 : 12, fontWeight: 600, cursor: "pointer",
  border: variant === "primary" ? "none" : `1px solid ${C.border}`,
  background: variant === "primary" ? C.primary : C.card,
  color: variant === "primary" ? "white" : C.text,
  display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
});

function MiniBar({ data, color }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 32 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, borderRadius: "2px 2px 0 0", height: `${Math.max(10, (v / max) * 100)}%`, background: i === data.length - 1 ? color : `${color}44` }} />
      ))}
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} style={{ width: 42, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: value ? C.primary : "#cbd5e1", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 4, width: 16, height: 16, borderRadius: "50%", background: "white", transition: "left 0.2s", left: value ? 22 : 4, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
    </button>
  );
}

function NavIcon({ id, size = 16 }) {
  const s = size;
  const icons = {
    overview: <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    invoices: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    tax: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 9h.01M15 15h.01M16 8l-8 8"/></svg>,
    vendors: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    bank: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/><line x1="12" y1="15" x2="12" y2="17"/></svg>,
    accounting: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    settings: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    menu: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    close: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    logout: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  };
  return icons[id] || null;
}

// ═══ DATA ════════════════════════════════════════════════════════════════════
const INVOICES = [
  { id: "INV-001", vendor: "AWS India Pvt Ltd", date: "Mar 28", due: "Apr 27", amount: 48200, gst: 8676, status: "Pending", category: "Cloud" },
  { id: "INV-002", vendor: "Razorpay Solutions", date: "Mar 25", due: "Apr 24", amount: 12500, gst: 2250, status: "Paid", category: "Payment GW" },
  { id: "INV-003", vendor: "Google Workspace", date: "Mar 20", due: "Apr 19", amount: 6800, gst: 1224, status: "Paid", category: "SaaS" },
  { id: "INV-004", vendor: "Zoho Corporation", date: "Mar 15", due: "Apr 14", amount: 9500, gst: 1710, status: "Overdue", category: "SaaS" },
  { id: "INV-005", vendor: "Freshworks Inc", date: "Mar 10", due: "Apr 9", amount: 15000, gst: 2700, status: "Pending", category: "CRM" },
  { id: "INV-006", vendor: "Infosys BPM Ltd", date: "Mar 5", due: "Apr 4", amount: 85000, gst: 15300, status: "Paid", category: "Services" },
  { id: "INV-007", vendor: "Digital Ocean LLC", date: "Feb 28", due: "Mar 29", amount: 22400, gst: 4032, status: "Overdue", category: "Cloud" },
];

const VENDORS = [
  { name: "AWS India Pvt Ltd", gstin: "29AABCA1234B1Z5", type: "Cloud Provider", outstanding: 48200, invoices: 12 },
  { name: "Razorpay Solutions", gstin: "29AABCR5678C1Z2", type: "FinTech", outstanding: 0, invoices: 8 },
  { name: "Google Workspace", gstin: "27AAACG0569G1ZF", type: "SaaS", outstanding: 0, invoices: 6 },
  { name: "Zoho Corporation", gstin: "33AABCZ3456D1Z1", type: "SaaS", outstanding: 9500, invoices: 15 },
  { name: "Infosys BPM Ltd", gstin: "29AACCI0782C1ZF", type: "Services", outstanding: 0, invoices: 3 },
  { name: "Digital Ocean LLC", gstin: "N/A (Import)", type: "Cloud Provider", outstanding: 22400, invoices: 5 },
];

const GST_SUMMARY = [
  { period: "Mar 2024", igst: 24892, cgst: 8450, sgst: 8450, total: 41792, filed: false },
  { period: "Feb 2024", igst: 18300, cgst: 7200, sgst: 7200, total: 32700, filed: true },
  { period: "Jan 2024", igst: 21600, cgst: 9100, sgst: 9100, total: 39800, filed: true },
  { period: "Dec 2023", igst: 19450, cgst: 8600, sgst: 8600, total: 36650, filed: true },
];

const BANK_TXN = [
  { date: "Mar 29", desc: "NEFT - Infosys BPM Payment", ref: "NEFT01", type: "Credit", amount: 85000, matched: true },
  { date: "Mar 28", desc: "IMPS - AWS India Bill Pay", ref: "IMPS01", type: "Debit", amount: 56876, matched: true },
  { date: "Mar 27", desc: "UPI - Office Rent Q1", ref: "UPI01", type: "Debit", amount: 45000, matched: false },
  { date: "Mar 26", desc: "NEFT - Salary Mar Batch", ref: "NEFT02", type: "Debit", amount: 240000, matched: true },
  { date: "Mar 25", desc: "RTGS - Client XYZ Advance", ref: "RTGS01", type: "Credit", amount: 500000, matched: false },
  { date: "Mar 24", desc: "IMPS - Google Workspace", ref: "IMPS02", type: "Debit", amount: 8024, matched: true },
];

const fmt = (n) => "₹" + n.toLocaleString("en-IN");

const statusBadge = (status) => badge(
  status === "Paid" ? C.green : status === "Overdue" ? C.red : C.amber,
  status === "Paid" ? C.greenBg : status === "Overdue" ? C.redBg : C.amberBg,
  status === "Paid" ? C.greenBorder : status === "Overdue" ? C.redBorder : C.amberBorder,
);

function ScrollTable({ children }) {
  return (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      <table style={{ width: "100%", minWidth: 580, borderCollapse: "collapse" }}>{children}</table>
    </div>
  );
}
const TH = ({ children, right }) => (
  <th style={{ padding: "10px 14px", textAlign: right ? "right" : "left", fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{children}</th>
);

function StatCard({ label, value, sub, color, data }) {
  return (
    <div style={{ ...card, display: "flex", flexDirection: "column", gap: 7 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted }}>{sub}</div>}
      {data && <MiniBar data={data} color={color} />}
    </div>
  );
}

// ═══ PAGES ═══════════════════════════════════════════════════════════════════

function OverviewPage({ bp }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ borderRadius: 10, padding: "14px 16px", background: "linear-gradient(135deg,#eff4ff,#f0fdfa)", border: `1px solid ${C.primaryBorder}` }}>
        <div style={{ fontWeight: 700, fontSize: bp.isMobile ? 15 : 17, color: C.text }}>Hello, Ravi! 👋</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>GST return due in <strong style={{ color: C.amber }}>21 days</strong>. Books are open for Mar 2024.</div>
        {bp.isMobile && (
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button style={{ ...btn("outline", true), flex: 1, justifyContent: "center" }}>+ Expense</button>
            <button style={{ ...btn("primary", true), flex: 1, justifyContent: "center" }}>+ Invoice</button>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: bp.isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10 }}>
        <StatCard label="Total Payables" value={fmt(183400)} sub="5 open invoices" color={C.red} data={[40,55,48,70,60,80,75,95,88,110,100,120]} />
        <StatCard label="GST Liability" value={fmt(41792)} sub="Due Apr 20" color={C.amber} data={[28,35,32,40,36,45,42,50,46,55,48,58]} />
        <StatCard label="Vendors" value="6" sub="2 with outstanding" color={C.primary} data={[4,4,5,5,5,6,6,6,6,6,6,6]} />
        <StatCard label="Reconciled" value="83%" sub="5 of 6 matched" color={C.green} data={[60,65,70,68,75,72,78,80,77,85,82,83]} />
      </div>

      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, fontWeight: 700, fontSize: 13, color: C.text }}>Recent Invoices</div>
        {bp.isMobile ? (
          INVOICES.slice(0, 4).map((inv, i) => (
            <div key={i} style={{ padding: "13px 16px", borderBottom: i < 3 ? `1px solid ${C.borderLight}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{inv.vendor}</div>
                <span style={statusBadge(inv.status)}>{inv.status}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: 11, color: C.faint }}>{inv.id} · Due {inv.due}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{fmt(inv.amount)}</div>
              </div>
            </div>
          ))
        ) : (
          <ScrollTable>
            <thead><tr style={{ background: "#fafbfc", borderBottom: `1px solid ${C.border}` }}><TH>Vendor</TH><TH>Invoice</TH><TH>Amount</TH><TH>Status</TH></tr></thead>
            <tbody>
              {INVOICES.slice(0, 5).map((inv, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                  <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600, color: C.text }}>{inv.vendor}</td>
                  <td style={{ padding: "11px 14px", fontSize: 12, color: C.faint }}>{inv.id} · {inv.date}</td>
                  <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 700, color: C.text }}>{fmt(inv.amount)}</td>
                  <td style={{ padding: "11px 14px" }}><span style={statusBadge(inv.status)}>{inv.status}</span></td>
                </tr>
              ))}
            </tbody>
          </ScrollTable>
        )}
      </div>

      <div style={{ ...card }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 10 }}>GST Summary — Mar 2024</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {[["IGST", fmt(24892), C.primary], ["CGST", fmt(8450), C.teal], ["SGST", fmt(8450), C.purple], ["Total", fmt(41792), C.red]].map(([l, v, color]) => (
            <div key={l} style={{ textAlign: "center", padding: "10px 4px", borderRadius: 8, background: C.bg, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, marginBottom: 4 }}>{l}</div>
              <div style={{ fontSize: bp.isMobile ? 11 : 13, fontWeight: 800, color }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InvoicesPage({ bp }) {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? INVOICES : INVOICES.filter(i => i.status === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: bp.isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10 }}>
        {[
          { label: "Total", val: INVOICES.length, color: C.primary },
          { label: "Pending", val: fmt(INVOICES.filter(i=>i.status==="Pending").reduce((s,i)=>s+i.amount,0)), color: C.amber },
          { label: "Overdue", val: fmt(INVOICES.filter(i=>i.status==="Overdue").reduce((s,i)=>s+i.amount,0)), color: C.red },
          { label: "Paid", val: fmt(INVOICES.filter(i=>i.status==="Paid").reduce((s,i)=>s+i.amount,0)), color: C.green },
        ].map((s,i) => (
          <div key={i} style={{ ...card, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6, overflowX: "auto", WebkitOverflowScrolling: "touch", paddingBottom: 2 }}>
        {["All","Pending","Paid","Overdue"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0, border: `1px solid ${filter===f?C.primary:C.border}`, background: filter===f?C.primaryLight:"transparent", color: filter===f?C.primary:C.muted }}>{f}</button>
        ))}
        <button style={{ ...btn("primary", true), flexShrink: 0, marginLeft: "auto" }}>+ New</button>
      </div>

      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        {bp.isMobile ? (
          filtered.length === 0
            ? <div style={{ padding: 32, textAlign: "center", color: C.faint, fontSize: 13 }}>No invoices found.</div>
            : filtered.map((inv, i) => (
              <div key={i} style={{ padding: "14px 16px", borderBottom: i < filtered.length-1 ? `1px solid ${C.borderLight}` : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{inv.vendor}</div>
                    <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>{inv.id} · Due {inv.due}</div>
                  </div>
                  <span style={statusBadge(inv.status)}>{inv.status}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={badge(C.purple, C.purpleBg, "#c4b5fd")}>{inv.category}</span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{fmt(inv.amount)}</div>
                    <div style={{ fontSize: 10, color: C.faint }}>+GST {fmt(inv.gst)}</div>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <ScrollTable>
            <thead><tr style={{ background: "#fafbfc", borderBottom: `1px solid ${C.border}` }}><TH>Invoice #</TH><TH>Vendor</TH><TH>Category</TH><TH>Date</TH><TH>Amount</TH><TH>GST</TH><TH>Status</TH><TH>Action</TH></tr></thead>
            <tbody>
              {filtered.map((inv, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                  <td style={{ padding:"11px 14px", fontSize:12, fontWeight:600, color:C.primary }}>{inv.id}</td>
                  <td style={{ padding:"11px 14px", fontSize:13, fontWeight:600, color:C.text }}>{inv.vendor}</td>
                  <td style={{ padding:"11px 14px" }}><span style={badge(C.purple,C.purpleBg,"#c4b5fd")}>{inv.category}</span></td>
                  <td style={{ padding:"11px 14px", fontSize:12, color:C.muted }}>{inv.date}</td>
                  <td style={{ padding:"11px 14px", fontSize:13, fontWeight:700, color:C.text }}>{fmt(inv.amount)}</td>
                  <td style={{ padding:"11px 14px", fontSize:12, color:C.muted }}>{fmt(inv.gst)}</td>
                  <td style={{ padding:"11px 14px" }}><span style={statusBadge(inv.status)}>{inv.status}</span></td>
                  <td style={{ padding:"11px 14px" }}><button style={{ padding:"4px 10px", fontSize:11, fontWeight:600, borderRadius:5, cursor:"pointer", border:`1px solid ${C.primaryBorder}`, background:C.primaryLight, color:C.primary }}>Pay</button></td>
                </tr>
              ))}
            </tbody>
          </ScrollTable>
        )}
      </div>
    </div>
  );
}

function TaxPage({ bp }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ borderRadius: 8, padding: "12px 16px", background: C.amberBg, border: `1px solid ${C.amberBorder}` }}>
        <div style={{ display: "flex", alignItems: bp.isMobile ? "flex-start" : "center", gap: 10, flexDirection: bp.isMobile ? "column" : "row" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>⚠️ GSTR-3B due April 20, 2024</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Total liability: ₹41,792 · Penalty: ₹50/day if late</div>
          </div>
          <button style={{ ...btn("primary", true), width: bp.isMobile ? "100%" : "auto", justifyContent: "center" }}>File Now</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: bp.isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10 }}>
        {[["ITC Available", fmt(38600), C.green], ["ITC Claimed", fmt(32400), C.primary], ["ITC Reversed", fmt(2800), C.red], ["Net Utilised", fmt(29600), C.teal]].map(([l,v,color]) => (
          <div key={l} style={{ ...card, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{l}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "13px 16px", borderBottom: `1px solid ${C.border}`, fontWeight: 700, fontSize: 13, color: C.text }}>GST Filing History</div>
        {GST_SUMMARY.map((g, i) => {
          return (
            <div key={i} style={{ padding: "14px 16px", borderBottom: i < GST_SUMMARY.length-1 ? `1px solid ${C.borderLight}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{g.period}</div>
                <span style={badge(g.filed?C.green:C.amber, g.filed?C.greenBg:C.amberBg, g.filed?C.greenBorder:C.amberBorder)}>{g.filed ? "✓ Filed" : "Pending"}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: !g.filed ? 10 : 0 }}>
                {[["IGST",fmt(g.igst)],["CGST",fmt(g.cgst)],["SGST",fmt(g.sgst)],["Total",fmt(g.total)]].map(([l,v]) => (
                  <div key={l}><div style={{ fontSize:10, color:C.faint }}>{l}</div><div style={{ fontSize:bp.isMobile?11:13, fontWeight:600, color:C.text }}>{v}</div></div>
                ))}
              </div>
              {!g.filed && <button style={{ ...btn("primary", true), width: "100%", justifyContent: "center" }}>File Return</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VendorsPage({ bp }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: bp.isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10 }}>
        {[
          { label: "Total Vendors", val: VENDORS.length, color: C.primary },
          { label: "With Outstanding", val: VENDORS.filter(v=>v.outstanding>0).length, color: C.red },
          { label: "Total Outstanding", val: fmt(VENDORS.reduce((s,v)=>s+v.outstanding,0)), color: C.amber },
          { label: "Total Invoices", val: VENDORS.reduce((s,v)=>s+v.invoices,0), color: C.teal },
        ].map((s,i) => (
          <div key={i} style={{ ...card, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={btn("primary", true)}>+ Add Vendor</button>
      </div>
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        {bp.isMobile ? (
          VENDORS.map((v, i) => (
            <div key={i} style={{ padding: "14px 16px", borderBottom: i < VENDORS.length-1 ? `1px solid ${C.borderLight}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{v.name}</div>
                  <div style={{ fontSize: 10, color: C.faint, fontFamily: "monospace", marginTop: 2 }}>{v.gstin}</div>
                </div>
                <span style={badge(C.purple,C.purpleBg,"#c4b5fd")}>{v.type}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: 12, color: C.muted }}>{v.invoices} invoices</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: v.outstanding > 0 ? C.red : C.green }}>{v.outstanding > 0 ? fmt(v.outstanding) : "Nil"}</div>
              </div>
            </div>
          ))
        ) : (
          <ScrollTable>
            <thead><tr style={{ background: "#fafbfc", borderBottom: `1px solid ${C.border}` }}><TH>Vendor</TH><TH>GSTIN</TH><TH>Type</TH><TH>Invoices</TH><TH>Outstanding</TH><TH>Action</TH></tr></thead>
            <tbody>
              {VENDORS.map((v, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                  <td style={{ padding:"12px 14px", fontSize:13, fontWeight:700, color:C.text }}>{v.name}</td>
                  <td style={{ padding:"12px 14px", fontSize:11, fontFamily:"monospace", color:C.muted }}>{v.gstin}</td>
                  <td style={{ padding:"12px 14px" }}><span style={badge(C.purple,C.purpleBg,"#c4b5fd")}>{v.type}</span></td>
                  <td style={{ padding:"12px 14px", fontSize:13, fontWeight:600, color:C.text }}>{v.invoices}</td>
                  <td style={{ padding:"12px 14px", fontSize:13, fontWeight:700, color:v.outstanding>0?C.red:C.green }}>{v.outstanding>0?fmt(v.outstanding):"Nil"}</td>
                  <td style={{ padding:"12px 14px" }}><button style={{ padding:"4px 10px", fontSize:11, fontWeight:600, borderRadius:5, cursor:"pointer", border:`1px solid ${C.border}`, background:"white", color:C.text }}>View</button></td>
                </tr>
              ))}
            </tbody>
          </ScrollTable>
        )}
      </div>
    </div>
  );
}

function BankPage({ bp }) {
  const unmatched = BANK_TXN.filter(t => !t.matched).length;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: bp.isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10 }}>
        {[
          { label: "Transactions", val: BANK_TXN.length, color: C.primary },
          { label: "Matched", val: BANK_TXN.filter(t=>t.matched).length, color: C.green },
          { label: "Unmatched", val: unmatched, color: C.red },
          { label: "Credits", val: fmt(BANK_TXN.filter(t=>t.type==="Credit").reduce((s,t)=>s+t.amount,0)), color: C.teal },
        ].map((s,i) => (
          <div key={i} style={{ ...card, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>
      {unmatched > 0 && (
        <div style={{ borderRadius: 8, padding: "12px 16px", background: C.redBg, border: `1px solid ${C.redBorder}` }}>
          <div style={{ fontSize: 13, color: C.text }}>🔴 <strong>{unmatched} unmatched</strong> transactions need attention.</div>
        </div>
      )}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>HDFC Current A/C ****3421</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Balance: ₹12,84,350</div>
        </div>
        {bp.isMobile ? (
          BANK_TXN.map((t, i) => (
            <div key={i} style={{ padding: "13px 16px", borderBottom: i < BANK_TXN.length-1 ? `1px solid ${C.borderLight}` : "none", background: !t.matched ? "#fffcf0" : "white" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                <div style={{ flex: 1, minWidth: 0, marginRight: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.desc}</div>
                  <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>{t.date}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: t.type==="Credit"?C.green:C.text }}>{t.type==="Credit"?"+":"−"}{fmt(t.amount)}</div>
                  <span style={badge(t.type==="Credit"?C.green:C.red, t.type==="Credit"?C.greenBg:C.redBg, t.type==="Credit"?C.greenBorder:C.redBorder)}>{t.type}</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.matched ? C.green : C.amber }} />
                <span style={{ fontSize: 11, color: t.matched ? C.green : C.amber, fontWeight: 600 }}>{t.matched ? "Matched" : "Tap to match"}</span>
              </div>
            </div>
          ))
        ) : (
          <ScrollTable>
            <thead><tr style={{ background: "#fafbfc", borderBottom: `1px solid ${C.border}` }}><TH>Date</TH><TH>Description</TH><TH>Type</TH><TH right>Amount</TH><TH>Status</TH><TH>Action</TH></tr></thead>
            <tbody>
              {BANK_TXN.map((t, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.borderLight}`, background: !t.matched ? "#fffcf0" : "white" }}>
                  <td style={{ padding:"11px 14px", fontSize:12, color:C.muted }}>{t.date}</td>
                  <td style={{ padding:"11px 14px", fontSize:13, fontWeight:600, color:C.text }}>{t.desc}</td>
                  <td style={{ padding:"11px 14px" }}><span style={badge(t.type==="Credit"?C.green:C.red, t.type==="Credit"?C.greenBg:C.redBg, t.type==="Credit"?C.greenBorder:C.redBorder)}>{t.type}</span></td>
                  <td style={{ padding:"11px 14px", textAlign:"right", fontSize:13, fontWeight:700, color:t.type==="Credit"?C.green:C.text }}>{t.type==="Credit"?"+":"−"}{fmt(t.amount)}</td>
                  <td style={{ padding:"11px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:t.matched?C.green:C.amber }} />
                      <span style={{ fontSize:11, color:t.matched?C.green:C.amber, fontWeight:600 }}>{t.matched?"Matched":"Unmatched"}</span>
                    </div>
                  </td>
                  <td style={{ padding:"11px 14px" }}><button style={{ padding:"4px 10px", fontSize:11, fontWeight:600, borderRadius:5, cursor:"pointer", border:`1px solid ${t.matched?C.border:C.amberBorder}`, background:t.matched?"white":C.amberBg, color:t.matched?C.text:C.amber }}>{t.matched?"View":"Match"}</button></td>
                </tr>
              ))}
            </tbody>
          </ScrollTable>
        )}
      </div>
    </div>
  );
}

function AccountingPage({ bp }) {
  const [sub, setSub] = useState("journal");
  const journals = [
    { date: "Mar 29", ref: "JE-088", narration: "AWS Invoice accrue Mar", debit: "Cloud Expenses", credit: "Accounts Payable", amount: 48200 },
    { date: "Mar 28", ref: "JE-087", narration: "Salary payable Mar 2024", debit: "Salary Expenses", credit: "Salary Payable", amount: 240000 },
    { date: "Mar 27", ref: "JE-086", narration: "Office rent Q1 2024", debit: "Rent Expenses", credit: "Bank Account", amount: 45000 },
    { date: "Mar 26", ref: "JE-085", narration: "Depreciation — Laptops", debit: "Depr. Expense", credit: "Accumulated Depr.", amount: 8500 },
  ];
  const trial = [
    { account: "Revenue", debit: 0, credit: 1280000 },
    { account: "Cloud Expenses", debit: 190400, credit: 0 },
    { account: "Salary Expenses", debit: 720000, credit: 0 },
    { account: "Rent Expenses", debit: 135000, credit: 0 },
    { account: "Accounts Payable", debit: 0, credit: 183400 },
    { account: "Bank Account", debit: 1284350, credit: 0 },
    { account: "GST Payable", debit: 0, credit: 41792 },
    { account: "Equity", debit: 0, credit: 1156558 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 4, overflowX: "auto", WebkitOverflowScrolling: "touch", paddingBottom: 2 }}>
        {[["journal","Journal Entries"],["trial","Trial Balance"],["pnl","P&L"]].map(([id, label]) => (
          <button key={id} onClick={() => setSub(id)} style={{ padding:"7px 14px", borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer", flexShrink:0, border:`1px solid ${sub===id?C.primary:C.border}`, background:sub===id?C.primaryLight:"transparent", color:sub===id?C.primary:C.muted }}>{label}</button>
        ))}
      </div>

      {sub === "journal" && (
        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontWeight:700, fontSize:13, color:C.text }}>Journal Entries</div>
            <button style={btn("primary",true)}>+ New Entry</button>
          </div>
          {bp.isMobile ? (
            journals.map((j, i) => (
              <div key={i} style={{ padding:"13px 16px", borderBottom:i<journals.length-1?`1px solid ${C.borderLight}`:"none" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:12, fontFamily:"monospace", color:C.primary, fontWeight:600 }}>{j.ref}</span>
                  <span style={{ fontSize:13, fontWeight:800, color:C.text }}>{fmt(j.amount)}</span>
                </div>
                <div style={{ fontSize:13, color:C.text, marginBottom:4 }}>{j.narration}</div>
                <div style={{ fontSize:11, color:C.muted }}>Dr: {j.debit} · Cr: {j.credit}</div>
              </div>
            ))
          ) : (
            <ScrollTable>
              <thead><tr style={{ background:"#fafbfc", borderBottom:`1px solid ${C.border}` }}><TH>Date</TH><TH>Ref</TH><TH>Narration</TH><TH>Debit</TH><TH>Credit</TH><TH right>Amount</TH></tr></thead>
              <tbody>
                {journals.map((j,i) => (
                  <tr key={i} style={{ borderBottom:`1px solid ${C.borderLight}` }}>
                    <td style={{ padding:"11px 14px", fontSize:12, color:C.muted }}>{j.date}</td>
                    <td style={{ padding:"11px 14px", fontSize:12, fontFamily:"monospace", color:C.primary, fontWeight:600 }}>{j.ref}</td>
                    <td style={{ padding:"11px 14px", fontSize:12, color:C.text }}>{j.narration}</td>
                    <td style={{ padding:"11px 14px", fontSize:12, color:C.red, fontWeight:600 }}>Dr: {j.debit}</td>
                    <td style={{ padding:"11px 14px", fontSize:12, color:C.green, fontWeight:600 }}>Cr: {j.credit}</td>
                    <td style={{ padding:"11px 14px", textAlign:"right", fontSize:13, fontWeight:700, color:C.text }}>{fmt(j.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </ScrollTable>
          )}
        </div>
      )}

      {sub === "trial" && (
        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}`, fontWeight:700, fontSize:13, color:C.text }}>Trial Balance — Mar 31, 2024</div>
          {trial.map((row, i) => (
            <div key={i} style={{ display:"flex", padding:"11px 16px", borderBottom:`1px solid ${C.borderLight}` }}>
              <div style={{ flex:1, fontSize:13, fontWeight:600, color:C.text }}>{row.account}</div>
              <div style={{ width:bp.isMobile?88:130, textAlign:"right", fontSize:13, fontWeight:row.debit?700:400, color:row.debit?C.red:C.faint }}>{row.debit?fmt(row.debit):"—"}</div>
              <div style={{ width:bp.isMobile?88:130, textAlign:"right", fontSize:13, fontWeight:row.credit?700:400, color:row.credit?C.green:C.faint }}>{row.credit?fmt(row.credit):"—"}</div>
            </div>
          ))}
          <div style={{ display:"flex", padding:"12px 16px", background:"#f0f4ff", borderTop:`2px solid ${C.border}` }}>
            <div style={{ flex:1, fontWeight:800, fontSize:13, color:C.text }}>Total</div>
            <div style={{ width:bp.isMobile?88:130, textAlign:"right", fontWeight:800, color:C.red }}>{fmt(trial.reduce((s,r)=>s+r.debit,0))}</div>
            <div style={{ width:bp.isMobile?88:130, textAlign:"right", fontWeight:800, color:C.green }}>{fmt(trial.reduce((s,r)=>s+r.credit,0))}</div>
          </div>
        </div>
      )}

      {sub === "pnl" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {[
            { title:"Income", items:[["Revenue from Services",1280000],["Other Income",42000]], color:C.green, total:1322000 },
            { title:"Expenses", items:[["Cloud Expenses",190400],["Salary",720000],["Rent",135000],["SaaS & Tools",62400],["Depreciation",25500]], color:C.red, total:1133300 },
          ].map((section, si) => (
            <div key={si} style={{ ...card, padding:0, overflow:"hidden" }}>
              <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}`, fontWeight:700, fontSize:13, color:C.text }}>{section.title}</div>
              {section.items.map(([label,val],i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"11px 16px", borderBottom:`1px solid ${C.borderLight}` }}>
                  <span style={{ fontSize:13, color:C.text }}>{label}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{fmt(val)}</span>
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 16px", background:"#fafbfc" }}>
                <span style={{ fontWeight:700, fontSize:13, color:C.text }}>Total {section.title}</span>
                <span style={{ fontWeight:800, fontSize:15, color:section.color }}>{fmt(section.total)}</span>
              </div>
            </div>
          ))}
          <div style={{ ...card, display:"flex", justifyContent:"space-between", alignItems:"center", background:C.primaryLight, border:`1px solid ${C.primaryBorder}` }}>
            <div style={{ fontWeight:700, fontSize:15, color:C.text }}>Net Profit</div>
            <div style={{ fontWeight:900, fontSize:bp.isMobile?20:24, color:C.green }}>₹1,88,700</div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsPage({ bp }) {
  const [tab, setTab] = useState("company");
  const [notif, setNotif] = useState({ gstDue: true, invoice: true, bank: false });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display:"flex", gap:4, overflowX:"auto", WebkitOverflowScrolling:"touch", paddingBottom:2 }}>
        {["company","tax","fiscal","notifications","integrations"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding:"7px 14px", borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer", flexShrink:0, border:`1px solid ${tab===t?C.primary:C.border}`, background:tab===t?C.primaryLight:"transparent", color:tab===t?C.primary:C.muted, textTransform:"capitalize" }}>{t}</button>
        ))}
      </div>

      {tab === "company" && (
        <div style={card}>
          <div style={{ fontWeight:700, fontSize:13, color:C.text, marginBottom:14 }}>Company Information</div>
          <div style={{ display:"grid", gridTemplateColumns:bp.isMobile?"1fr":"1fr 1fr", gap:12 }}>
            {[["Company Name","Nexus Technologies Pvt Ltd"],["GSTIN","29AABCN1234A1Z5"],["PAN","AABCN1234A"],["TAN","BLRN01234A"],["Address","123 Koramangala, Bangalore - 560034"],["Industry","Technology / SaaS"],["Fiscal Year","April 1"],["Currency","INR (₹)"]].map(([l,v]) => (
              <div key={l}>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:5 }}>{l}</div>
                <input defaultValue={v} style={{ width:"100%", boxSizing:"border-box", padding:"9px 12px", borderRadius:7, fontSize:13, background:C.bg, border:`1px solid ${C.border}`, color:C.text, outline:"none" }} />
              </div>
            ))}
          </div>
          <button style={{ ...btn("primary"), marginTop:16, width:bp.isMobile?"100%":"auto", justifyContent:"center" }}>Save Changes</button>
        </div>
      )}

      {tab === "tax" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {[
            { title:"GST Configuration", fields:[["GST Type","Regular Taxpayer"],["GSTIN","29AABCN1234A1Z5"],["HSN Code","998314"],["SAC Code","998314"]] },
            { title:"TDS Configuration", fields:[["TAN Number","BLRN01234A"],["Sections","194J, 194C"],["Deductor Type","Company"],["Filing","Quarterly"]] },
          ].map((section, si) => (
            <div key={si} style={card}>
              <div style={{ fontWeight:700, fontSize:13, color:C.text, marginBottom:14 }}>{section.title}</div>
              <div style={{ display:"grid", gridTemplateColumns:bp.isMobile?"1fr":"1fr 1fr", gap:12 }}>
                {section.fields.map(([l,v]) => (
                  <div key={l}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:5 }}>{l}</div>
                    <input defaultValue={v} style={{ width:"100%", boxSizing:"border-box", padding:"9px 12px", borderRadius:7, fontSize:13, background:C.bg, border:`1px solid ${C.border}`, color:C.text, outline:"none" }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "notifications" && (
        <div style={card}>
          <div style={{ fontWeight:700, fontSize:13, color:C.text, marginBottom:14 }}>Notification Preferences</div>
          {[
            { key:"gstDue", label:"GST Return Due Reminders", desc:"7 days before GSTR-3B due date" },
            { key:"invoice", label:"Invoice Overdue Alerts", desc:"Daily alerts for overdue payments" },
            { key:"bank", label:"Bank Reconciliation Summary", desc:"Weekly unmatched transaction digest" },
          ].map((n,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderBottom:i<2?`1px solid ${C.borderLight}`:"none", gap:12 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{n.label}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{n.desc}</div>
              </div>
              <Toggle value={notif[n.key]} onChange={v => setNotif(p => ({ ...p, [n.key]: v }))} />
            </div>
          ))}
        </div>
      )}

      {tab === "integrations" && (
        <div style={{ display:"grid", gridTemplateColumns:bp.isMobile?"1fr":bp.isTablet?"1fr 1fr":"repeat(3,1fr)", gap:12 }}>
          {[
            { name:"Razorpay", desc:"Auto-match payment settlements", status:"Connected", icon:"💳" },
            { name:"HDFC NetBanking", desc:"Bank statement import", status:"Connected", icon:"🏦" },
            { name:"GST Portal", desc:"Auto-file GSTR returns", status:"Pending", icon:"🏛️" },
            { name:"Tally ERP", desc:"Two-way sync with Tally", status:"Not Connected", icon:"📊" },
            { name:"Slack", desc:"Finance alerts to Slack", status:"Connected", icon:"💬" },
            { name:"Quickbooks", desc:"Migrate from QB", status:"Not Connected", icon:"📒" },
          ].map((int, i) => (
            <div key={i} style={{ ...card, display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ fontSize:22 }}>{int.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:C.text }}>{int.name}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{int.desc}</div>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:5, alignItems:"flex-end", flexShrink:0 }}>
                <span style={badge(int.status==="Connected"?C.green:int.status==="Pending"?C.amber:C.muted, int.status==="Connected"?C.greenBg:int.status==="Pending"?C.amberBg:"#f3f4f6", int.status==="Connected"?C.greenBorder:int.status==="Pending"?C.amberBorder:"#d1d5db")}>{int.status}</span>
                <button style={{ padding:"4px 10px", fontSize:11, fontWeight:600, borderRadius:5, cursor:"pointer", border:`1px solid ${C.border}`, background:"white", color:C.text }}>{int.status==="Connected"?"Manage":"Connect"}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "fiscal" && (
        <div style={card}>
          <div style={{ fontWeight:700, fontSize:13, color:C.text, marginBottom:14 }}>Fiscal Year Settings</div>
          <div style={{ display:"grid", gridTemplateColumns:bp.isMobile?"1fr":"1fr 1fr", gap:12 }}>
            {[["Fiscal Year","April 2023 – March 2024"],["Current Period","March 2024"],["Books Lock Date","Not Set"],["Accounting Method","Accrual"],["Depreciation Method","SLM (Straight Line)"],["Threshold","₹5,000"]].map(([l,v]) => (
              <div key={l}>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:5 }}>{l}</div>
                <input defaultValue={v} style={{ width:"100%", boxSizing:"border-box", padding:"9px 12px", borderRadius:7, fontSize:13, background:C.bg, border:`1px solid ${C.border}`, color:C.text, outline:"none" }} />
              </div>
            ))}
          </div>
          <button style={{ ...btn("primary"), marginTop:16 }}>Save Settings</button>
        </div>
      )}
    </div>
  );
}

// ═══ ROOT ════════════════════════════════════════════════════════════════════
export default function AccountingApp() {
  const bp = useBreakpoint();
  const [page, setPage] = useState("overview");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── Logout confirmation state ──────────────────────────────────
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    // உங்கள் logout logic இங்கே — e.g. localStorage clear, redirect
    alert("You have been logged out successfully!");
    setShowLogoutConfirm(false);
  };

  const nav = [
    { id:"overview", label:"Overview", short:"Home" },
    { id:"invoices", label:"Purchase Invoices", short:"Invoices" },
    { id:"tax", label:"GST & Tax", short:"GST" },
    { id:"vendors", label:"Vendors", short:"Vendors" },
    { id:"bank", label:"Bank Reconciliation", short:"Bank" },
    { id:"accounting", label:"Center Accounting", short:"Books" },
    { id:"settings", label:"System Settings", short:"Settings" },
  ];

  const bottomItems = [nav[0], nav[1], nav[2], nav[4], nav[6]];

  const navigate = (id) => { setPage(id); setDrawerOpen(false); };
  const currentLabel = nav.find(n => n.id === page)?.label || "";

  const pages = {
    overview: <OverviewPage bp={bp} />,
    invoices: <InvoicesPage bp={bp} />,
    tax: <TaxPage bp={bp} />,
    vendors: <VendorsPage bp={bp} />,
    bank: <BankPage bp={bp} />,
    accounting: <AccountingPage bp={bp} />,
    settings: <SettingsPage bp={bp} />,
  };

  // ── Sidebar content (shared) ───────────────────────────────────
  const SidebarContent = () => (
    <>
      <div style={{ padding:"16px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:900, fontSize:15 }}>N</div>
          <div>
            <div style={{ fontWeight:800, fontSize:13, color:C.text }}>Nexus Books</div>
            <div style={{ fontSize:10, color:C.faint }}>FY 2023–24</div>
          </div>
        </div>
        {!bp.isDesktop && (
          <button onClick={() => setDrawerOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, padding:4 }}><NavIcon id="close" size={18} /></button>
        )}
      </div>

      <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto" }}>
        {nav.map(item => {
          const active = page === item.id;
          return (
            <button key={item.id} onClick={() => navigate(item.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"10px 11px", borderRadius:7, marginBottom:2, border:"none", background:active?C.primaryLight:"transparent", color:active?C.primary:C.muted, cursor:"pointer", fontSize:13, fontWeight:active?700:500, textAlign:"left", borderLeft:active?`3px solid ${C.primary}`:"3px solid transparent" }}>
              <span style={{ color:active?C.primary:C.faint }}><NavIcon id={item.id} /></span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* ── User profile + Logout ── */}
      <div style={{ padding:"10px", borderTop:`1px solid ${C.border}` }}>
        <div style={{ padding:"9px 11px", borderRadius:8, background:C.bg, display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:6, background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:10, fontWeight:800, flexShrink:0 }}>RS</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.text }}>Ravi Shankar</div>
            <div style={{ fontSize:10, color:C.faint }}>Founder · Admin</div>
          </div>
          {/* Logout button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            title="Logout"
            style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, padding:4, display:"flex", alignItems:"center", borderRadius:6, flexShrink:0 }}
            onMouseEnter={e => { e.currentTarget.style.background = C.redBg; e.currentTarget.style.color = C.red; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = C.muted; }}
          >
            <NavIcon id="logout" size={16} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:"'Segoe UI', system-ui, sans-serif", color:C.text }}>

      {/* ── Logout Confirmation Modal ── */}
      {showLogoutConfirm && (
        <>
          <div
            onClick={() => setShowLogoutConfirm(false)}
            style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:100 }}
          />
          <div style={{
            position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
            background:"white", borderRadius:14, padding:"28px 28px 22px", zIndex:101,
            width: bp.isMobile ? "calc(100vw - 48px)" : 340,
            boxShadow:"0 8px 40px rgba(0,0,0,0.18)", textAlign:"center"
          }}>
            <div style={{ fontSize:36, marginBottom:12 }}>👋</div>
            <div style={{ fontWeight:800, fontSize:16, color:C.text, marginBottom:6 }}>Logout?</div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:22 }}>Are you sure you want to logout from Nexus Books?</div>
            <div style={{ display:"flex", gap:10 }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{ flex:1, padding:"10px", borderRadius:8, border:`1px solid ${C.border}`, background:"white", color:C.text, fontSize:13, fontWeight:600, cursor:"pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                style={{ flex:1, padding:"10px", borderRadius:8, border:"none", background:C.red, color:"white", fontSize:13, fontWeight:700, cursor:"pointer" }}
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* Desktop sidebar */}
      {bp.isDesktop && (
        <aside style={{ width:220, minHeight:"100vh", background:C.sidebar, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", position:"sticky", top:0, flexShrink:0 }}>
          <SidebarContent />
        </aside>
      )}

      {/* Tablet/mobile overlay drawer */}
      {!bp.isDesktop && drawerOpen && (
        <>
          <div onClick={() => setDrawerOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:40 }} />
          {bp.isTablet ? (
            <aside style={{ position:"fixed", left:0, top:0, bottom:0, width:240, background:C.sidebar, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", zIndex:50, boxShadow:"4px 0 20px rgba(0,0,0,0.1)" }}>
              <SidebarContent />
            </aside>
          ) : (
            <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"white", borderRadius:"16px 16px 0 0", zIndex:50, maxHeight:"80vh", overflowY:"auto", boxShadow:"0 -4px 30px rgba(0,0,0,0.12)" }}>
              <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontWeight:700, fontSize:14, color:C.text }}>All Modules</div>
                <button onClick={() => setDrawerOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted }}><NavIcon id="close" size={18} /></button>
              </div>
              {nav.map(item => {
                const active = page === item.id;
                return (
                  <button key={item.id} onClick={() => navigate(item.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"15px 20px", border:"none", borderBottom:`1px solid ${C.borderLight}`, background:active?C.primaryLight:"transparent", color:active?C.primary:C.text, cursor:"pointer", fontSize:15, fontWeight:active?700:500, textAlign:"left" }}>
                    <span style={{ color:active?C.primary:C.muted }}><NavIcon id={item.id} size={18} /></span>
                    {item.label}
                  </button>
                );
              })}
              {/* Mobile drawer logout */}
              <button
                onClick={() => { setDrawerOpen(false); setShowLogoutConfirm(true); }}
                style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"15px 20px", border:"none", borderBottom:`1px solid ${C.borderLight}`, background:"transparent", color:C.red, cursor:"pointer", fontSize:15, fontWeight:600, textAlign:"left" }}
              >
                <NavIcon id="logout" size={18} />
                Logout
              </button>
              <div style={{ height:20 }} />
            </div>
          )}
        </>
      )}

      {/* Main */}
      <main style={{ flex:1, minWidth:0, overflowY:"auto", paddingBottom: bp.isMobile ? 68 : 0 }}>
        {/* Topbar */}
        <div style={{ position:"sticky", top:0, zIndex:20, padding: bp.isMobile ? "11px 14px" : "11px 22px", background:"rgba(245,247,250,0.96)", backdropFilter:"blur(10px)", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            {!bp.isDesktop && (
              <button onClick={() => setDrawerOpen(true)} style={{ background:"none", border:"none", cursor:"pointer", color:C.text, padding:4, display:"flex" }}>
                <NavIcon id="menu" size={20} />
              </button>
            )}
            <div>
              <div style={{ fontWeight:800, fontSize:bp.isMobile?14:15, color:C.text }}>{currentLabel}</div>
              {!bp.isMobile && <div style={{ fontSize:10, color:C.faint, marginTop:1 }}>Nexus Technologies · March 2024</div>}
            </div>
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            {!bp.isMobile && (
              <>
                <button style={{ ...btn("outline",true) }}>📥 Import</button>
                <button style={{ ...btn("outline",true) }}>📤 Export</button>
              </>
            )}
            <span style={{ fontSize:11, padding:"4px 8px", borderRadius:6, background:C.greenBg, border:`1px solid ${C.greenBorder}`, color:C.green, fontWeight:600, whiteSpace:"nowrap" }}>
              {bp.isMobile ? "● Open" : "● Books Open"}
            </span>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: bp.isMobile ? "14px 14px" : bp.isTablet ? "18px 20px" : "22px 26px" }}>
          {pages[page]}
        </div>
      </main>

      {/* Mobile bottom navigation */}
      {bp.isMobile && (
        <nav style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:30, background:"white", borderTop:`1px solid ${C.border}`, display:"flex", paddingBottom:"env(safe-area-inset-bottom, 0px)", boxShadow:"0 -2px 12px rgba(0,0,0,0.06)" }}>
          {bottomItems.map(item => {
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => navigate(item.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"9px 4px 7px", border:"none", background:"transparent", cursor:"pointer", color:active?C.primary:C.faint, gap:3, minWidth:0 }}>
                <NavIcon id={item.id} size={20} />
                <span style={{ fontSize:9, fontWeight:active?700:500, letterSpacing:"0.02em" }}>{item.short}</span>
                {active && <div style={{ width:4, height:4, borderRadius:"50%", background:C.primary }} />}
              </button>
            );
          })}
          <button onClick={() => setDrawerOpen(true)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"9px 4px 7px", border:"none", background:"transparent", cursor:"pointer", color:C.faint, gap:3 }}>
            <NavIcon id="menu" size={20} />
            <span style={{ fontSize:9, fontWeight:500, letterSpacing:"0.02em" }}>More</span>
          </button>
        </nav>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import type { AuthUser } from "../types";

interface UserDashboardProps {
  user: AuthUser;
  onLogout: () => void;
}

// ─── Responsive Hook ──────────────────────────────────────────────────────────
function useScreen() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024, w };
}

// ─── Color Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#f5f7fa", card: "#ffffff",
  border: "#e8ecf0", borderLight: "#f0f3f6",
  text: "#1a2332", muted: "#6b7a8d", faint: "#a8b4c0",
  primary: "#2563eb", primaryLight: "#eff4ff", primaryBorder: "#bfccfd",
  green: "#16a34a", greenBg: "#f0fdf4", greenBorder: "#86efac",
  red: "#dc2626", redBg: "#fff5f5", redBorder: "#fca5a5",
  amber: "#d97706", amberBg: "#fffbeb", amberBorder: "#fcd34d",
  purple: "#7c3aed", purpleBg: "#f5f3ff",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

const statusStyle = (s: string): React.CSSProperties => {
  const map: Record<string, [string, string, string]> = {
    Paid:    [C.green,   C.greenBg,      C.greenBorder],
    Filed:   [C.green,   C.greenBg,      C.greenBorder],
    Posted:  [C.green,   C.greenBg,      C.greenBorder],
    Overdue: [C.red,     C.redBg,        C.redBorder],
    Pending: [C.amber,   C.amberBg,      C.amberBorder],
    Draft:   [C.amber,   C.amberBg,      C.amberBorder],
    Sent:    [C.primary, C.primaryLight, C.primaryBorder],
  };
  const [color, bg, border] = map[s] || [C.muted, C.bg, C.border];
  return { fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, color, background:bg, border:`1px solid ${border}`, whiteSpace:"nowrap", display:"inline-block" };
};

const btnP = (full=false): React.CSSProperties => ({ padding:"9px 16px", borderRadius:7, fontSize:13, fontWeight:600, cursor:"pointer", background:C.primary, border:"none", color:"white", display:"flex", alignItems:"center", gap:6, justifyContent:"center", width:full?"100%":"auto" });
const btnO = (full=false): React.CSSProperties => ({ padding:"8px 14px", borderRadius:7, fontSize:13, fontWeight:600, cursor:"pointer", background:"white", border:`1px solid ${C.border}`, color:C.text, display:"flex", alignItems:"center", gap:6, justifyContent:"center", width:full?"100%":"auto" });

// ─── Icons ────────────────────────────────────────────────────────────────────
type IP = { size?: number; color?: string };
const DashIcon    = ({ size=16,color="currentColor" }: IP) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
const InvoiceIcon = ({ size=16,color="currentColor" }: IP) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const ExpenseIcon = ({ size=16,color="currentColor" }: IP) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 000 4h4a2 2 0 010 4H8"/><line x1="12" y1="6" x2="12" y2="18"/></svg>;
const GSTIcon     = ({ size=16,color="currentColor" }: IP) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>;
const JournalIcon = ({ size=16,color="currentColor" }: IP) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
const TrialIcon   = ({ size=16,color="currentColor" }: IP) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>;
const LogoutIcon  = ({ size=14 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const MenuIcon    = ({ size=20 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const CloseIcon   = ({ size=20 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const PlusIcon    = ({ size=13 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const CheckIcon   = () => <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} style={{ width:42, height:24, borderRadius:12, border:"none", cursor:"pointer", background:value?C.primary:"#cbd5e1", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
      <div style={{ position:"absolute", top:4, width:16, height:16, borderRadius:"50%", background:"white", transition:"left 0.2s", left:value?22:4, boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
    </button>
  );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Spark({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data), min = Math.min(...data);
  const w = 80, h = 28;
  const pts = data.map((v, i) => `${(i/(data.length-1))*w},${h-((v-min)/(max-min||1))*(h-4)-2}`).join(" ");
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/></svg>;
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KCard({ label, value, sub, color, data, icon }: { label:string; value:string; sub?:string; color:string; data:number[]; icon:string }) {
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", display:"flex", flexDirection:"column", gap:5 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>{label}</div>
          <div style={{ fontSize:20, fontWeight:800, color:C.text }}>{value}</div>
          {sub && <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{sub}</div>}
        </div>
        <div style={{ fontSize:20 }}>{icon}</div>
      </div>
      <Spark data={data} color={color} />
    </div>
  );
}

// ─── Mobile Card Row (replaces table on mobile) ───────────────────────────────
function MobileRow({ children }: { children: React.ReactNode }) {
  return <div style={{ padding:"13px 14px", borderBottom:`1px solid ${C.borderLight}` }}>{children}</div>;
}

// ─── Table helpers ────────────────────────────────────────────────────────────
const TH = ({ ch }: { ch: string }) => (
  <th style={{ padding:"9px 12px", textAlign:"left", fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", whiteSpace:"nowrap", background:"#fafbfc", borderBottom:`1px solid ${C.border}` }}>{ch}</th>
);
const TD = ({ children, bold, color, mono }: { children: React.ReactNode; bold?: boolean; color?: string; mono?: boolean }) => (
  <td style={{ padding:"10px 12px", fontSize:12, fontWeight:bold?700:400, color:color||C.text, whiteSpace:"nowrap", borderBottom:`1px solid ${C.borderLight}`, fontFamily:mono?"monospace":"inherit" }}>{children}</td>
);

// ─── Filter Button ────────────────────────────────────────────────────────────
const FBtn = ({ active, label, onClick }: { active:boolean; label:string; onClick:()=>void }) => (
  <button onClick={onClick} style={{ padding:"6px 12px", borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer", border:`1px solid ${active?C.primary:C.border}`, background:active?C.primaryLight:"white", color:active?C.primary:C.muted, flexShrink:0 }}>{label}</button>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const INVOICES = [
  { id:"INV-041", customer:"Rajesh Traders",      date:"Mar 28", due:"Apr 28", amount:45000,  gst:8100,  status:"Paid"    },
  { id:"INV-042", customer:"Meena Enterprises",   date:"Mar 26", due:"Apr 25", amount:120000, gst:21600, status:"Sent"    },
  { id:"INV-043", customer:"Karthik & Co",        date:"Mar 24", due:"Apr 23", amount:78500,  gst:14130, status:"Overdue" },
  { id:"INV-044", customer:"Sri Murugan Stores",  date:"Mar 22", due:"May 1",  amount:234000, gst:42120, status:"Draft"   },
  { id:"INV-045", customer:"Anbu Industries",     date:"Mar 20", due:"Apr 19", amount:56750,  gst:10215, status:"Paid"    },
  { id:"INV-046", customer:"Priya Medical",       date:"Mar 18", due:"Apr 17", amount:18000,  gst:900,   status:"Sent"    },
  { id:"INV-047", customer:"Vel Murugan Traders", date:"Mar 15", due:"Apr 14", amount:92400,  gst:16632, status:"Overdue" },
];
const EXPENSES = [
  { id:"EXP-001", category:"Office Rent",     vendor:"Krishna Properties", date:"Mar 1",  amount:35000, gst:6300, status:"Paid",    billable:false },
  { id:"EXP-002", category:"Internet & Phone",vendor:"BSNL / Airtel",      date:"Mar 5",  amount:4500,  gst:810,  status:"Paid",    billable:false },
  { id:"EXP-003", category:"Software License",vendor:"Zoho Corporation",   date:"Mar 8",  amount:12000, gst:2160, status:"Paid",    billable:true  },
  { id:"EXP-004", category:"Travel",          vendor:"Self",               date:"Mar 12", amount:8200,  gst:0,    status:"Pending", billable:true  },
  { id:"EXP-005", category:"Printing",        vendor:"Sri Printers",       date:"Mar 15", amount:3400,  gst:612,  status:"Paid",    billable:false },
  { id:"EXP-006", category:"Staff Salary",    vendor:"Payroll",            date:"Mar 31", amount:85000, gst:0,    status:"Pending", billable:false },
];
const GST_FILINGS = [
  { form:"GSTR-1",  period:"Mar 2024", due:"Apr 11", taxable:"₹4,44,650", output:"₹80,037", input:"₹0",      net:"₹80,037", status:"Pending" },
  { form:"GSTR-3B", period:"Mar 2024", due:"Apr 20", taxable:"₹4,44,650", output:"₹80,037", input:"₹11,106", net:"₹68,931", status:"Pending" },
  { form:"GSTR-1",  period:"Feb 2024", due:"Mar 11", taxable:"₹3,82,000", output:"₹68,760", input:"₹0",      net:"₹68,760", status:"Filed"   },
  { form:"GSTR-3B", period:"Feb 2024", due:"Mar 20", taxable:"₹3,82,000", output:"₹68,760", input:"₹9,850",  net:"₹58,910", status:"Filed"   },
];
const JOURNALS = [
  { id:"JE-018", date:"Mar 28", narration:"Sales — Rajesh Traders",  entries:[{acc:"Accounts Receivable",type:"Dr",amt:"₹53,100"},{acc:"Sales Revenue",type:"Cr",amt:"₹45,000"},{acc:"GST Payable",type:"Cr",amt:"₹8,100"}],   status:"Posted" },
  { id:"JE-017", date:"Mar 26", narration:"Expense — Office Rent",   entries:[{acc:"Rent Expense",type:"Dr",amt:"₹35,000"},{acc:"GST Input",type:"Dr",amt:"₹6,300"},{acc:"Bank — SBI",type:"Cr",amt:"₹41,300"}],             status:"Posted" },
  { id:"JE-016", date:"Mar 24", narration:"Payment — Karthik & Co", entries:[{acc:"Bank — HDFC",type:"Dr",amt:"₹78,500"},{acc:"Accounts Receivable",type:"Cr",amt:"₹78,500"}],                                               status:"Posted" },
  { id:"JE-015", date:"Mar 20", narration:"Purchase — Zoho License", entries:[{acc:"Software Expense",type:"Dr",amt:"₹12,000"},{acc:"GST Input",type:"Dr",amt:"₹2,160"},{acc:"Accounts Payable",type:"Cr",amt:"₹14,160"}],  status:"Draft"  },
];
const TRIAL_BALANCE = [
  { code:"1001", account:"Cash in Hand",        type:"Asset",    debit:45200,   credit:0       },
  { code:"1002", account:"Bank — SBI",          type:"Asset",    debit:1245820, credit:0       },
  { code:"1003", account:"Accounts Receivable", type:"Asset",    debit:444650,  credit:0       },
  { code:"1004", account:"GST Input Credit",    type:"Asset",    debit:11106,   credit:0       },
  { code:"2001", account:"Accounts Payable",    type:"Liability",debit:0,       credit:154160  },
  { code:"2002", account:"GST Payable",         type:"Liability",debit:0,       credit:80037   },
  { code:"3001", account:"Owner's Capital",     type:"Equity",   debit:0,       credit:1000000 },
  { code:"4001", account:"Sales Revenue",       type:"Income",   debit:0,       credit:444650  },
  { code:"5001", account:"Rent Expense",        type:"Expense",  debit:35000,   credit:0       },
  { code:"5002", account:"Staff Salary",        type:"Expense",  debit:85000,   credit:0       },
  { code:"5003", account:"Software Expense",    type:"Expense",  debit:12000,   credit:0       },
];

type PageId = "dashboard"|"invoices"|"expenses"|"gst"|"journal"|"trial";
const typeColors: Record<string,string> = { Asset:C.primary, Liability:C.red, Equity:C.purple, Income:C.green, Expense:C.amber };

// ═══ MAIN COMPONENT ═══════════════════════════════════════════════════════════
export default function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const sc = useScreen();
  const [page, setPage]           = useState<PageId>("dashboard");
  const [drawerOpen, setDrawer]   = useState(false);
  const [invFilter, setInvFilter] = useState("All");
  const [expFilter, setExpFilter] = useState("All");
  const [tbFilter, setTbFilter]   = useState("All");
  const [expandJE, setExpandJE]   = useState<string|null>(null);
  const [newJE, setNewJE]         = useState(false);
  const [autoGST, setAutoGST]     = useState(true);

  const NAV: { id: PageId; label: string; short: string; Icon: React.ComponentType<IP> }[] = [
    { id:"dashboard", label:"Dashboard",     short:"Home",     Icon:DashIcon    },
    { id:"invoices",  label:"Invoices",      short:"Invoice",  Icon:InvoiceIcon },
    { id:"expenses",  label:"Expenses",      short:"Expense",  Icon:ExpenseIcon },
    { id:"gst",       label:"GST Filing",    short:"GST",      Icon:GSTIcon     },
    { id:"journal",   label:"Journal Entry", short:"Journal",  Icon:JournalIcon },
    { id:"trial",     label:"Trial Balance", short:"Trial",    Icon:TrialIcon   },
  ];

  const navigate = (id: PageId) => { setPage(id); setDrawer(false); };
  const filtInv  = invFilter==="All" ? INVOICES : INVOICES.filter(i=>i.status===invFilter);
  const filtExp  = expFilter==="All" ? EXPENSES : EXPENSES.filter(e=>e.status===expFilter);
  const filtTB   = tbFilter==="All"  ? TRIAL_BALANCE : TRIAL_BALANCE.filter(a=>a.type===tbFilter);
  const totalDr  = TRIAL_BALANCE.reduce((s,r)=>s+r.debit,0);
  const totalCr  = TRIAL_BALANCE.reduce((s,r)=>s+r.credit,0);

  const px = sc.isMobile ? 14 : 22;
  const inputS: React.CSSProperties = { width:"100%", boxSizing:"border-box", padding:"9px 12px", borderRadius:7, fontSize:13, background:C.bg, border:`1px solid ${C.border}`, color:C.text, outline:"none" };

  // ── Shared Sidebar Content ──────────────────────────────────────────────────
  const SidebarContent = () => (
    <>
      <div style={{ padding:"16px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:900, fontSize:16 }}>₹</div>
          <div>
            <div style={{ fontWeight:800, fontSize:13, color:C.text }}>Nickname</div>
            <div style={{ fontSize:10, color:C.faint }}>Accounting · FY 24–25</div>
          </div>
        </div>
        {!sc.isDesktop && (
          <button onClick={()=>setDrawer(false)} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, padding:4 }}>
            <CloseIcon size={18} />
          </button>
        )}
      </div>
      <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto" }}>
        {NAV.map(({ id, label, Icon }) => {
          const active = page === id;
          return (
            <button key={id} onClick={() => navigate(id)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"11px 12px", borderRadius:7, marginBottom:2, border:"none", background:active?C.primaryLight:"transparent", color:active?C.primary:C.muted, cursor:"pointer", fontSize:13, fontWeight:active?700:500, textAlign:"left", borderLeft:active?`3px solid ${C.primary}`:"3px solid transparent" }}>
              <Icon size={16} color={active?C.primary:C.faint} />
              <span style={{ flex:1 }}>{label}</span>
            </button>
          );
        })}
      </nav>
      <div style={{ padding:10, borderTop:`1px solid ${C.border}` }}>
        <div style={{ padding:"9px 11px", borderRadius:8, background:C.bg, display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:6, background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:10, fontWeight:800, flexShrink:0 }}>
            {user.name.split(" ").map(n=>n[0]).join("")}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name}</div>
            <div style={{ fontSize:10, color:C.faint, textTransform:"capitalize" }}>{user.role}</div>
          </div>
          <button onClick={onLogout} style={{ background:"none", border:"none", cursor:"pointer", color:C.faint, display:"flex", padding:3 }}><LogoutIcon size={13}/></button>
        </div>
      </div>
    </>
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:"'Segoe UI', system-ui, sans-serif", color:C.text }}>

      {/* Desktop sidebar */}
      {sc.isDesktop && (
        <aside style={{ width:210, minHeight:"100vh", position:"sticky", top:0, display:"flex", flexDirection:"column", background:C.card, borderRight:`1px solid ${C.border}`, flexShrink:0 }}>
          <SidebarContent />
        </aside>
      )}

      {/* Mobile / Tablet overlay drawer */}
      {!sc.isDesktop && drawerOpen && (
        <>
          <div onClick={()=>setDrawer(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.3)", zIndex:40 }} />
          {sc.isTablet ? (
            <aside style={{ position:"fixed", left:0, top:0, bottom:0, width:240, background:C.card, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", zIndex:50, boxShadow:"4px 0 20px rgba(0,0,0,0.1)" }}>
              <SidebarContent />
            </aside>
          ) : (
            /* Mobile: bottom sheet */
            <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"white", borderRadius:"16px 16px 0 0", zIndex:50, maxHeight:"80vh", overflowY:"auto", boxShadow:"0 -4px 30px rgba(0,0,0,0.12)" }}>
              <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontWeight:700, fontSize:14, color:C.text }}>All Modules</div>
                <button onClick={()=>setDrawer(false)} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted }}><CloseIcon size={18}/></button>
              </div>
              {NAV.map(({ id, label, Icon }) => {
                const active = page === id;
                return (
                  <button key={id} onClick={()=>navigate(id)}
                    style={{ width:"100%", display:"flex", alignItems:"center", gap:14, padding:"15px 20px", border:"none", borderBottom:`1px solid ${C.borderLight}`, background:active?C.primaryLight:"white", color:active?C.primary:C.text, cursor:"pointer", fontSize:15, fontWeight:active?700:500, textAlign:"left" }}>
                    <Icon size={18} color={active?C.primary:C.faint} />
                    {label}
                  </button>
                );
              })}
              <div style={{ height:20 }} />
            </div>
          )}
        </>
      )}

      {/* Main */}
      <main style={{ flex:1, minWidth:0, overflowY:"auto", paddingBottom:sc.isMobile?68:0 }}>

        {/* Topbar */}
        <div style={{ position:"sticky", top:0, zIndex:20, padding:`11px ${px}px`, background:"rgba(245,247,250,0.97)", backdropFilter:"blur(10px)", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {!sc.isDesktop && (
              <button onClick={()=>setDrawer(true)} style={{ background:"none", border:"none", cursor:"pointer", color:C.text, padding:4, display:"flex" }}>
                <MenuIcon size={20}/>
              </button>
            )}
            <div>
              <div style={{ fontWeight:800, fontSize:sc.isMobile?14:15, color:C.text }}>{NAV.find(n=>n.id===page)?.label}</div>
              {!sc.isMobile && <div style={{ fontSize:10, color:C.faint, marginTop:1 }}>{new Date().toDateString()}</div>}
            </div>
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <span style={{ fontSize:11, padding:"4px 10px", borderRadius:6, background:C.greenBg, border:`1px solid ${C.greenBorder}`, color:C.green, fontWeight:600, whiteSpace:"nowrap" }}>
              {sc.isMobile?"● Open":"● Books Open"}
            </span>
            {!sc.isMobile && <span style={{ fontSize:11, padding:"4px 10px", borderRadius:6, background:C.primaryLight, border:`1px solid ${C.primaryBorder}`, color:C.primary, fontWeight:600 }}>👤 {user.name.split(" ")[0]}</span>}
            {sc.isDesktop && <button onClick={onLogout} style={btnO()}>Logout</button>}
          </div>
        </div>

        <div style={{ padding:`18px ${px}px`, display:"flex", flexDirection:"column", gap:16 }}>

          {/* ══════════ DASHBOARD ══════════ */}
          {page==="dashboard" && (<>

            {/* Welcome */}
            <div style={{ borderRadius:10, padding:"14px 16px", background:"linear-gradient(135deg,#eff4ff,#f0fdf9)", border:`1px solid ${C.primaryBorder}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:sc.isMobile?"flex-start":"center", flexDirection:sc.isMobile?"column":"row", gap:10 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:sc.isMobile?15:16, color:C.text }}>Hello, {user.name.split(" ")[0]}! 👋</div>
                  <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>GST return due in <strong style={{ color:C.amber }}>21 days</strong> · Mar 2024 books are open.</div>
                </div>
                <div style={{ display:"flex", gap:8, width:sc.isMobile?"100%":"auto" }}>
                  <button style={btnO(sc.isMobile)} onClick={()=>setPage("expenses")}><PlusIcon/> Expense</button>
                  <button style={btnP(sc.isMobile)} onClick={()=>setPage("invoices")}><PlusIcon/> Invoice</button>
                </div>
              </div>
            </div>

            {/* KPI Cards — 2 col mobile, 4 col desktop */}
            <div style={{ display:"grid", gridTemplateColumns:sc.isMobile?"1fr 1fr":"repeat(4,1fr)", gap:10 }}>
              <KCard label="Total Invoiced" value="₹6,44,650" sub="7 invoices"        color={C.primary} icon="🧾" data={[28,35,30,42,38,50,45,58,52,65,60,72]}/>
              <KCard label="Total Expenses" value="₹1,55,900" sub="6 expenses"        color={C.red}     icon="💸" data={[18,22,20,28,24,32,28,36,33,42,38,45]}/>
              <KCard label="GST Payable"    value="₹68,931"   sub="Due Apr 20"        color={C.amber}   icon="🧮" data={[35,32,38,40,36,44,42,48,45,52,50,55]}/>
              <KCard label="Outstanding"    value="₹4,44,650" sub="3 invoices unpaid" color={C.green}   icon="⏳" data={[20,25,22,30,28,35,32,40,36,44,42,48]}/>
            </div>

            {/* Recent tables — stacked on mobile, side-by-side on desktop */}
            <div style={{ display:"grid", gridTemplateColumns:sc.isDesktop?"1fr 1fr":"1fr", gap:14 }}>
              {/* Recent Invoices */}
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ fontWeight:700, fontSize:13, color:C.text }}>Recent Invoices</div>
                  <button onClick={()=>setPage("invoices")} style={{ background:"none", border:"none", cursor:"pointer", color:C.primary, fontSize:12, fontWeight:600 }}>View all →</button>
                </div>
                {INVOICES.slice(0,4).map((inv,i)=>(
                  <MobileRow key={i}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{inv.customer}</div>
                        <div style={{ fontSize:10, color:C.faint, marginTop:2 }}>{inv.id} · {inv.date}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:13, fontWeight:800, color:C.text }}>{fmt(inv.amount)}</div>
                        <span style={{ ...statusStyle(inv.status), marginTop:3, display:"inline-block" }}>{inv.status}</span>
                      </div>
                    </div>
                  </MobileRow>
                ))}
              </div>

              {/* Recent Expenses */}
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ fontWeight:700, fontSize:13, color:C.text }}>Recent Expenses</div>
                  <button onClick={()=>setPage("expenses")} style={{ background:"none", border:"none", cursor:"pointer", color:C.primary, fontSize:12, fontWeight:600 }}>View all →</button>
                </div>
                {EXPENSES.slice(0,4).map((exp,i)=>(
                  <MobileRow key={i}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{exp.category}</div>
                        <div style={{ fontSize:10, color:C.faint, marginTop:2 }}>{exp.vendor}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:13, fontWeight:800, color:C.text }}>{fmt(exp.amount)}</div>
                        <span style={{ ...statusStyle(exp.status), marginTop:3, display:"inline-block" }}>{exp.status}</span>
                      </div>
                    </div>
                  </MobileRow>
                ))}
              </div>
            </div>

            {/* GST Quick */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div style={{ fontWeight:700, fontSize:13 }}>GST Summary — Mar 2024</div>
                <button onClick={()=>setPage("gst")} style={{ background:"none", border:"none", cursor:"pointer", color:C.primary, fontSize:12, fontWeight:600 }}>File →</button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                {[["Output","₹80,037",C.red],["ITC","₹11,106",C.green],["Net","₹68,931",C.amber],["Due","Apr 20",C.primary]].map(([l,v,color])=>(
                  <div key={l} style={{ textAlign:"center", padding:"10px 6px", borderRadius:8, background:C.bg, border:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:10, color:C.muted, fontWeight:700, marginBottom:3, textTransform:"uppercase" }}>{l}</div>
                    <div style={{ fontSize:sc.isMobile?12:14, fontWeight:800, color }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </>)}

          {/* ══════════ INVOICES ══════════ */}
          {page==="invoices" && (<>
            <div style={{ display:"grid", gridTemplateColumns:sc.isMobile?"1fr 1fr":"repeat(4,1fr)", gap:10 }}>
              {[
                { label:"Total",   val:INVOICES.length,                                                        color:C.primary },
                { label:"Pending", val:fmt(INVOICES.filter(i=>i.status==="Sent").reduce((s,i)=>s+i.amount,0)), color:C.amber   },
                { label:"Overdue", val:fmt(INVOICES.filter(i=>i.status==="Overdue").reduce((s,i)=>s+i.amount,0)),color:C.red   },
                { label:"Paid",    val:fmt(INVOICES.filter(i=>i.status==="Paid").reduce((s,i)=>s+i.amount,0)),  color:C.green  },
              ].map((s,i)=>(
                <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ fontSize:10, color:C.muted, fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>{s.label}</div>
                  <div style={{ fontSize:20, fontWeight:800, color:s.color }}>{s.val}</div>
                </div>
              ))}
            </div>

            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
              <div style={{ padding:"12px 14px", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
                  {["All","Paid","Sent","Overdue","Draft"].map(f=><FBtn key={f} active={invFilter===f} label={f} onClick={()=>setInvFilter(f)}/>)}
                  <button style={{ ...btnP(), marginLeft:"auto", padding:"7px 14px", fontSize:12 }}><PlusIcon size={12}/> New</button>
                </div>
              </div>

              {/* Mobile card list */}
              {sc.isMobile ? (
                filtInv.map((inv,i)=>(
                  <MobileRow key={i}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{inv.customer}</div>
                        <div style={{ fontSize:10, color:C.faint, marginTop:2 }}>{inv.id} · Due {inv.due}</div>
                      </div>
                      <span style={statusStyle(inv.status)}>{inv.status}</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ fontSize:14, fontWeight:800, color:C.text }}>{fmt(inv.amount)}</div>
                      <div style={{ display:"flex", gap:6 }}>
                        <button style={{ padding:"5px 12px", fontSize:12, fontWeight:600, borderRadius:6, cursor:"pointer", border:`1px solid ${C.primaryBorder}`, background:C.primaryLight, color:C.primary }}>View</button>
                        {inv.status!=="Paid" && <button style={{ padding:"5px 12px", fontSize:12, fontWeight:600, borderRadius:6, cursor:"pointer", border:`1px solid ${C.greenBorder}`, background:C.greenBg, color:C.green }}>Record</button>}
                      </div>
                    </div>
                  </MobileRow>
                ))
              ) : (
                /* Desktop table */
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
                    <thead><tr>{["Invoice #","Customer","Date","Due Date","Amount","GST","Status","Action"].map(h=><TH key={h} ch={h}/>)}</tr></thead>
                    <tbody>{filtInv.map((inv,i)=>(
                      <tr key={i}>
                        <TD color={C.primary} bold>{inv.id}</TD>
                        <TD bold>{inv.customer}</TD>
                        <TD color={C.muted}>{inv.date}</TD>
                        <TD color={inv.status==="Overdue"?C.red:C.muted}>{inv.due}</TD>
                        <TD bold>{fmt(inv.amount)}</TD>
                        <TD color={C.muted}>{fmt(inv.gst)}</TD>
                        <TD><span style={statusStyle(inv.status)}>{inv.status}</span></TD>
                        <TD>
                          <div style={{ display:"flex", gap:5 }}>
                            <button style={{ padding:"4px 10px", fontSize:11, fontWeight:600, borderRadius:5, cursor:"pointer", border:`1px solid ${C.primaryBorder}`, background:C.primaryLight, color:C.primary }}>View</button>
                            {inv.status!=="Paid" && <button style={{ padding:"4px 10px", fontSize:11, fontWeight:600, borderRadius:5, cursor:"pointer", border:`1px solid ${C.greenBorder}`, background:C.greenBg, color:C.green }}>Record</button>}
                          </div>
                        </TD>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </div>
          </>)}

          {/* ══════════ EXPENSES ══════════ */}
          {page==="expenses" && (<>
            <div style={{ display:"grid", gridTemplateColumns:sc.isMobile?"1fr 1fr":"repeat(4,1fr)", gap:10 }}>
              {[
                { label:"Total",    val:fmt(EXPENSES.reduce((s,e)=>s+e.amount,0)), color:C.text    },
                { label:"Paid",     val:EXPENSES.filter(e=>e.status==="Paid").length+" items",    color:C.green   },
                { label:"Pending",  val:EXPENSES.filter(e=>e.status==="Pending").length+" items", color:C.amber   },
                { label:"Billable", val:EXPENSES.filter(e=>e.billable).length+" items",           color:C.primary },
              ].map((s,i)=>(
                <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ fontSize:10, color:C.muted, fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>{s.label}</div>
                  <div style={{ fontSize:20, fontWeight:800, color:s.color }}>{s.val}</div>
                </div>
              ))}
            </div>

            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
              <div style={{ padding:"12px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                {["All","Paid","Pending"].map(f=><FBtn key={f} active={expFilter===f} label={f} onClick={()=>setExpFilter(f)}/>)}
                <button style={{ ...btnP(), marginLeft:"auto", padding:"7px 14px", fontSize:12 }}><PlusIcon size={12}/> Add</button>
              </div>

              {sc.isMobile ? (
                filtExp.map((exp,i)=>(
                  <MobileRow key={i}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:5 }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{exp.category}</div>
                        <div style={{ fontSize:10, color:C.faint, marginTop:2 }}>{exp.vendor} · {exp.date}</div>
                      </div>
                      <span style={statusStyle(exp.status)}>{exp.status}</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ fontSize:14, fontWeight:800, color:C.text }}>{fmt(exp.amount)}</div>
                      {exp.billable && <span style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:20, background:C.purpleBg, border:"1px solid #c4b5fd", color:C.purple }}>Billable</span>}
                    </div>
                  </MobileRow>
                ))
              ) : (
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", minWidth:650 }}>
                    <thead><tr>{["ID","Category","Vendor","Date","Amount","GST","Billable","Status"].map(h=><TH key={h} ch={h}/>)}</tr></thead>
                    <tbody>{filtExp.map((exp,i)=>(
                      <tr key={i}>
                        <TD color={C.purple} bold>{exp.id}</TD>
                        <TD bold>{exp.category}</TD>
                        <TD color={C.muted}>{exp.vendor}</TD>
                        <TD color={C.muted}>{exp.date}</TD>
                        <TD bold>{fmt(exp.amount)}</TD>
                        <TD color={C.muted}>{exp.gst?fmt(exp.gst):"—"}</TD>
                        <TD>{exp.billable?<span style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:20, background:C.purpleBg, border:"1px solid #c4b5fd", color:C.purple }}>Yes</span>:<span style={{ fontSize:10, color:C.faint }}>No</span>}</TD>
                        <TD><span style={statusStyle(exp.status)}>{exp.status}</span></TD>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </div>
          </>)}

          {/* ══════════ GST FILING ══════════ */}
          {page==="gst" && (<>
            <div style={{ borderRadius:8, padding:"12px 14px", background:C.amberBg, border:`1px solid ${C.amberBorder}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:sc.isMobile?"flex-start":"center", flexDirection:sc.isMobile?"column":"row", gap:10 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:C.text }}>⚠️ GSTR-3B due April 20, 2024</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Net liability: ₹68,931 · Penalty ₹50/day after due date</div>
                </div>
                <button style={btnP(sc.isMobile)}>File Now</button>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:sc.isMobile?"1fr":"repeat(3,1fr)", gap:10 }}>
              {[
                { label:"Output GST", value:"₹80,037", sub:"Collected", color:C.red,   icon:"📤" },
                { label:"Input ITC",  value:"₹11,106", sub:"Available", color:C.green, icon:"📥" },
                { label:"Net Payable",value:"₹68,931", sub:"After ITC", color:C.amber, icon:"💳" },
              ].map((s,i)=>(
                <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", display:"flex", gap:12, alignItems:"center" }}>
                  <div style={{ fontSize:26 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize:10, color:C.muted, fontWeight:700, textTransform:"uppercase", marginBottom:3 }}>{s.label}</div>
                    <div style={{ fontSize:20, fontWeight:800, color:s.color }}>{s.value}</div>
                    <div style={{ fontSize:11, color:C.faint }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ fontWeight:700, fontSize:13 }}>GST Return Status</div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:12, color:C.muted }}>Auto</span>
                  <Toggle value={autoGST} onChange={setAutoGST}/>
                </div>
              </div>

              {sc.isMobile ? (
                GST_FILINGS.map((r,i)=>(
                  <MobileRow key={i}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                      <div>
                        <span style={{ fontWeight:700, color:C.primary, fontSize:14 }}>{r.form}</span>
                        <span style={{ fontSize:12, color:C.muted, marginLeft:8 }}>{r.period}</span>
                      </div>
                      <span style={statusStyle(r.status)}>{r.status}</span>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                      {[["Due",r.due],["Taxable",r.taxable],["Output",r.output],["Net",r.net]].map(([l,v])=>(
                        <div key={l}><div style={{ fontSize:9, color:C.faint, textTransform:"uppercase", marginBottom:2 }}>{l}</div><div style={{ fontSize:12, fontWeight:600, color:C.text }}>{v}</div></div>
                      ))}
                    </div>
                    <button style={{ ...r.status==="Pending"?btnP(true):btnO(true), fontSize:12, padding:"8px 12px" }}>
                      {r.status==="Filed"?"Download":"File Now"}
                    </button>
                  </MobileRow>
                ))
              ) : (
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
                    <thead><tr>{["Form","Period","Due Date","Taxable","Output GST","Input ITC","Net","Status","Action"].map(h=><TH key={h} ch={h}/>)}</tr></thead>
                    <tbody>{GST_FILINGS.map((r,i)=>(
                      <tr key={i}>
                        <TD color={C.primary} bold>{r.form}</TD>
                        <TD>{r.period}</TD>
                        <TD color={r.status==="Pending"?C.amber:C.muted}>{r.due}</TD>
                        <TD bold>{r.taxable}</TD>
                        <TD color={C.red}>{r.output}</TD>
                        <TD color={C.green}>{r.input}</TD>
                        <TD bold>{r.net}</TD>
                        <TD><span style={statusStyle(r.status)}>{r.status}</span></TD>
                        <TD><button style={{ padding:"4px 10px", fontSize:11, fontWeight:600, borderRadius:5, cursor:"pointer", border:`1px solid ${r.status==="Pending"?C.primaryBorder:C.border}`, background:r.status==="Pending"?C.primaryLight:"white", color:r.status==="Pending"?C.primary:C.muted }}>{r.status==="Filed"?"Download":"File Now"}</button></TD>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </div>

            {/* ITC Register */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
              <div style={{ padding:"12px 14px", borderBottom:`1px solid ${C.border}`, fontWeight:700, fontSize:13 }}>ITC Register — Mar 2024</div>
              <div style={{ display:"grid", gridTemplateColumns:sc.isMobile?"1fr 1fr":"repeat(4,1fr)", gap:0 }}>
                {[{l:"Opening ITC",v:"₹8,450",c:C.primary},{l:"ITC Claimed",v:"₹11,106",c:C.green},{l:"ITC Used",v:"₹11,106",c:C.amber},{l:"Closing ITC",v:"₹8,450",c:C.purple}].map((x,i)=>(
                  <div key={i} style={{ padding:"14px 16px", borderRight:!sc.isMobile&&i<3?`1px solid ${C.border}`:"none", borderBottom:sc.isMobile&&i<2?`1px solid ${C.border}`:"none" }}>
                    <div style={{ fontSize:10, color:C.muted, fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>{x.l}</div>
                    <div style={{ fontSize:17, fontWeight:800, color:x.c }}>{x.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </>)}

          {/* ══════════ JOURNAL ENTRY ══════════ */}
          {page==="journal" && (<>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
              {[
                { label:"Total",  val:JOURNALS.length,                               color:C.primary, icon:"📒" },
                { label:"Posted", val:JOURNALS.filter(j=>j.status==="Posted").length, color:C.green,   icon:"✅" },
                { label:"Draft",  val:JOURNALS.filter(j=>j.status==="Draft").length,  color:C.amber,   icon:"✏️" },
              ].map((s,i)=>(
                <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px", display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ fontSize:sc.isMobile?20:24 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize:10, color:C.muted, fontWeight:700, textTransform:"uppercase", marginBottom:2 }}>{s.label}</div>
                    <div style={{ fontSize:sc.isMobile?18:22, fontWeight:800, color:s.color }}>{s.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* New Entry Form */}
            {newJE && (
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ fontWeight:700, fontSize:13 }}>New Journal Entry</div>
                  <button onClick={()=>setNewJE(false)} style={{ background:"none", border:"none", cursor:"pointer", color:C.faint, fontSize:18 }}>✕</button>
                </div>
                <div style={{ padding:14 }}>
                  <div style={{ display:"grid", gridTemplateColumns:sc.isMobile?"1fr":"1fr 1fr 2fr", gap:10, marginBottom:12 }}>
                    <div><label style={{ fontSize:10, fontWeight:700, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase" }}>Date</label><input type="date" style={inputS}/></div>
                    <div><label style={{ fontSize:10, fontWeight:700, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase" }}>Ref No.</label><input placeholder="JE-019" style={inputS}/></div>
                    <div><label style={{ fontSize:10, fontWeight:700, color:C.muted, display:"block", marginBottom:4, textTransform:"uppercase" }}>Narration</label><input placeholder="Description..." style={inputS}/></div>
                  </div>
                  {sc.isMobile ? (
                    [1,2,3].map((_,i)=>(
                      <div key={i} style={{ marginBottom:10, padding:10, borderRadius:8, background:C.bg, border:`1px solid ${C.border}` }}>
                        <input placeholder="Account name" style={{ ...inputS, marginBottom:6 }}/>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
                          <select style={inputS}><option>Dr</option><option>Cr</option></select>
                          <input placeholder="Debit ₹" style={inputS}/>
                          <input placeholder="Credit ₹" style={inputS}/>
                        </div>
                      </div>
                    ))
                  ) : (
                    <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:12 }}>
                      <thead><tr>{["Account","Dr/Cr","Debit (₹)","Credit (₹)"].map(h=><TH key={h} ch={h}/>)}</tr></thead>
                      <tbody>{[1,2,3].map((_,i)=>(
                        <tr key={i} style={{ borderBottom:`1px solid ${C.borderLight}` }}>
                          <td style={{ padding:"7px 12px" }}><input placeholder="Select account" style={{ ...inputS, fontSize:12 }}/></td>
                          <td style={{ padding:"7px 12px" }}><select style={{ ...inputS, fontSize:12, width:"auto" }}><option>Dr</option><option>Cr</option></select></td>
                          <td style={{ padding:"7px 12px" }}><input placeholder="0.00" style={{ ...inputS, fontSize:12, textAlign:"right" }}/></td>
                          <td style={{ padding:"7px 12px" }}><input placeholder="0.00" style={{ ...inputS, fontSize:12, textAlign:"right" }}/></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  )}
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    <button style={btnP()}>Post Entry</button>
                    <button style={{ ...btnO(), color:C.amber, borderColor:C.amberBorder, background:C.amberBg }}>Save Draft</button>
                    <button onClick={()=>setNewJE(false)} style={btnO()}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {/* Entries list */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ fontWeight:700, fontSize:13 }}>Journal Entries</div>
                <button onClick={()=>setNewJE(true)} style={btnP()}><PlusIcon size={12}/> New Entry</button>
              </div>
              {JOURNALS.map((je,i)=>(
                <div key={i} style={{ borderBottom:i<JOURNALS.length-1?`1px solid ${C.borderLight}`:"none" }}>
                  <div onClick={()=>setExpandJE(expandJE===je.id?null:je.id)}
                    style={{ display:"flex", alignItems:"center", gap:10, padding:"13px 14px", cursor:"pointer", background:expandJE===je.id?"#fafbfc":"white" }}>
                    <div style={{ width:26, height:26, borderRadius:6, background:C.primaryLight, border:`1px solid ${C.primaryBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:C.primary, fontWeight:700, flexShrink:0 }}>
                      {expandJE===je.id?"▲":"▼"}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2, flexWrap:"wrap" }}>
                        <span style={{ fontWeight:700, fontSize:13, color:C.primary }}>{je.id}</span>
                        <span style={statusStyle(je.status)}>{je.status}</span>
                      </div>
                      <div style={{ fontSize:12, color:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{je.narration}</div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontSize:11, color:C.faint }}>{je.date}</div>
                      <div style={{ fontSize:10, color:C.faint, marginTop:2 }}>{je.entries.length} lines</div>
                    </div>
                  </div>
                  {expandJE===je.id && (
                    <div style={{ padding:"0 14px 12px" }}>
                      <div style={{ borderRadius:8, overflow:"hidden", border:`1px solid ${C.border}` }}>
                        {je.entries.map((e,j)=>(
                          <div key={j} style={{ display:"grid", gridTemplateColumns:sc.isMobile?"1fr 40px 80px":"2fr 60px 1fr 1fr", gap:0, borderBottom:j<je.entries.length-1?`1px solid ${C.borderLight}`:"none", alignItems:"center" }}>
                            <div style={{ padding:"8px 12px", fontSize:12, fontWeight:600, color:C.text }}>{e.acc}</div>
                            <div style={{ padding:"8px 8px" }}>
                              <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20, background:e.type==="Dr"?C.redBg:C.greenBg, color:e.type==="Dr"?C.red:C.green, border:`1px solid ${e.type==="Dr"?C.redBorder:C.greenBorder}` }}>{e.type}</span>
                            </div>
                            {!sc.isMobile && <div style={{ padding:"8px 12px", fontSize:12, fontWeight:e.type==="Dr"?700:400, color:e.type==="Dr"?C.red:C.faint }}>{e.type==="Dr"?e.amt:"—"}</div>}
                            <div style={{ padding:"8px 12px", fontSize:12, fontWeight:e.type==="Cr"?700:400, color:e.type==="Cr"?C.green:C.faint, textAlign:sc.isMobile?"right":"left" }}>{e.type==="Cr"?e.amt:sc.isMobile?"":sc.isMobile?"":sc.isMobile?"":"—"}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>)}

          {/* ══════════ TRIAL BALANCE ══════════ */}
          {page==="trial" && (<>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
              {[
                { label:"Total Debit",  val:fmt(totalDr), color:C.red,   icon:"📊" },
                { label:"Total Credit", val:fmt(totalCr), color:C.green, icon:"📊" },
                { label:"Difference",   val:fmt(Math.abs(totalDr-totalCr)), color:C.green, icon:"✅" },
              ].map((s,i)=>(
                <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px", display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ fontSize:sc.isMobile?18:22 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize:10, color:C.muted, fontWeight:700, textTransform:"uppercase", marginBottom:3 }}>{s.label}</div>
                    <div style={{ fontSize:sc.isMobile?14:18, fontWeight:800, color:s.color }}>{s.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Balanced banner */}
            <div style={{ borderRadius:8, padding:"12px 14px", background:C.greenBg, border:`1px solid ${C.greenBorder}`, display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background:C.green, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><CheckIcon/></div>
              <div style={{ flex:1 }}>
                <span style={{ fontWeight:700, color:C.green, fontSize:13 }}>Trial Balance is Balanced</span>
                {!sc.isMobile && <span style={{ fontSize:12, color:C.muted, marginLeft:8 }}>Debits = Credits · Mar 31, 2024</span>}
              </div>
              <button style={{ ...btnP(), padding:"7px 14px", fontSize:12, flexShrink:0 }}>Export PDF</button>
            </div>

            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
              <div style={{ padding:"12px 14px", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ fontWeight:700, fontSize:13, marginBottom:10 }}>Trial Balance — Mar 31, 2024</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {["All","Asset","Liability","Equity","Income","Expense"].map(f=>(
                    <button key={f} onClick={()=>setTbFilter(f)}
                      style={{ padding:"5px 10px", borderRadius:6, fontSize:11, fontWeight:600, cursor:"pointer", border:`1px solid ${tbFilter===f?(typeColors[f]||C.primary):C.border}`, background:tbFilter===f?`${typeColors[f]||C.primary}15`:"white", color:tbFilter===f?(typeColors[f]||C.primary):C.muted }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {sc.isMobile ? (
                <>
                  {filtTB.map((a,i)=>(
                    <MobileRow key={i}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                        <div>
                          <span style={{ fontWeight:700, fontSize:13, color:C.text }}>{a.account}</span>
                          <code style={{ fontSize:10, color:C.faint, marginLeft:8 }}>{a.code}</code>
                        </div>
                        <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:`${typeColors[a.type]}15`, color:typeColors[a.type], border:`1px solid ${typeColors[a.type]}35` }}>{a.type}</span>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                        <div><div style={{ fontSize:9, color:C.faint, textTransform:"uppercase", marginBottom:2 }}>Debit</div><div style={{ fontSize:13, fontWeight:a.debit?700:400, color:a.debit?C.red:C.faint }}>{a.debit?fmt(a.debit):"—"}</div></div>
                        <div><div style={{ fontSize:9, color:C.faint, textTransform:"uppercase", marginBottom:2 }}>Credit</div><div style={{ fontSize:13, fontWeight:a.credit?700:400, color:a.credit?C.green:C.faint }}>{a.credit?fmt(a.credit):"—"}</div></div>
                      </div>
                    </MobileRow>
                  ))}
                  <div style={{ padding:"12px 14px", background:"#f0f4ff", borderTop:`2px solid ${C.border}`, display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontWeight:800, color:C.text }}>TOTAL</span>
                    <div style={{ display:"flex", gap:16 }}>
                      <span style={{ fontWeight:800, color:C.red }}>{fmt(totalDr)}</span>
                      <span style={{ fontWeight:800, color:C.green }}>{fmt(totalCr)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", minWidth:600 }}>
                    <thead><tr>{["A/C Code","Account Name","Type","Debit","Credit","Balance"].map(h=><TH key={h} ch={h}/>)}</tr></thead>
                    <tbody>
                      {filtTB.map((a,i)=>(
                        <tr key={i}>
                          <TD mono color={C.muted}>{a.code}</TD>
                          <TD bold>{a.account}</TD>
                          <TD><span style={{ fontSize:10, fontWeight:700, padding:"2px 9px", borderRadius:20, background:`${typeColors[a.type]}15`, color:typeColors[a.type], border:`1px solid ${typeColors[a.type]}35` }}>{a.type}</span></TD>
                          <TD color={a.debit?C.red:C.faint} bold={!!a.debit}>{a.debit?fmt(a.debit):"—"}</TD>
                          <TD color={a.credit?C.green:C.faint} bold={!!a.credit}>{a.credit?fmt(a.credit):"—"}</TD>
                          <TD bold color={a.debit>0?C.red:C.green}>{a.debit>0?`${fmt(a.debit)} Dr`:`${fmt(a.credit)} Cr`}</TD>
                        </tr>
                      ))}
                      <tr style={{ background:"#f0f4ff", borderTop:`2px solid ${C.border}` }}>
                        <td colSpan={3} style={{ padding:"12px 12px", fontWeight:800, fontSize:13, color:C.text }}>TOTAL</td>
                        <td style={{ padding:"12px 12px", fontWeight:800, fontSize:14, color:C.red }}>{fmt(totalDr)}</td>
                        <td style={{ padding:"12px 12px", fontWeight:800, fontSize:14, color:C.green }}>{fmt(totalCr)}</td>
                        <td style={{ padding:"12px 12px", fontWeight:800, fontSize:13, color:C.green }}>Balanced ✓</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>)}

        </div>
      </main>

      {/* ── Mobile Bottom Navigation ─────────────────────────────────────────── */}
      {sc.isMobile && (
        <nav style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:30, background:"white", borderTop:`1px solid ${C.border}`, display:"flex", boxShadow:"0 -2px 12px rgba(0,0,0,0.06)", paddingBottom:"env(safe-area-inset-bottom,0px)" }}>
          {NAV.slice(0,5).map(({ id, short, Icon })=>{
            const active = page===id;
            return (
              <button key={id} onClick={()=>navigate(id)}
                style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"9px 4px 7px", border:"none", background:"transparent", cursor:"pointer", color:active?C.primary:C.faint, gap:3 }}>
                <Icon size={20} color={active?C.primary:C.faint}/>
                <span style={{ fontSize:9, fontWeight:active?700:500 }}>{short}</span>
                {active && <div style={{ width:4, height:4, borderRadius:"50%", background:C.primary }}/>}
              </button>
            );
          })}
          <button onClick={()=>setDrawer(true)}
            style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"9px 4px 7px", border:"none", background:"transparent", cursor:"pointer", color:C.faint, gap:3 }}>
            <MenuIcon size={20}/>
            <span style={{ fontSize:9, fontWeight:500 }}>More</span>
          </button>
        </nav>
      )}
    </div>
  );
}
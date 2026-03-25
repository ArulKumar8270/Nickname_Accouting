import { useState } from "react";
import type { AuthUser } from "../types";

interface AdminDashboardProps {
  user: AuthUser;
  onLogout: () => void;
}

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data), min = Math.min(...data);
  const w = 100, h = 40;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * (h - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Donut Chart ───────────────────────────────────────────────────────────────
function DonutChart({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = -90;
  const r = 36, cx = 44, cy = 44;
  const circumference = 2 * Math.PI * r;
  const arcs = segments.map((seg) => {
    const frac = seg.value / total;
    const dash = frac * circumference;
    const gap = circumference - dash;
    const rot = offset;
    offset += frac * 360;
    return { ...seg, dash, gap, rot };
  });
  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      {arcs.map((a, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={a.color} strokeWidth="10"
          strokeDasharray={`${a.dash} ${a.gap}`} strokeDashoffset={0}
          transform={`rotate(${a.rot} ${cx} ${cy})`} strokeLinecap="round" />
      ))}
      <circle cx={cx} cy={cy} r={26} fill="#0d1117" />
    </svg>
  );
}

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${
        value ? "bg-gradient-to-r from-indigo-500 to-sky-500" : "bg-white/10"
      }`}
    >
      <div className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all duration-200 ${
        value ? "left-[23px]" : "left-[3px]"
      }`} />
    </button>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function DashIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}
function UsersIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
      <path d="M16 3.13a4 4 0 010 7.75"/><path d="M21 21v-2a4 4 0 00-3-3.85"/>
    </svg>
  );
}
function ReportIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  );
}
function SettingsIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  );
}
function LogoutIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}
function MenuIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const REVENUE_DATA  = [32, 45, 38, 60, 52, 70, 65, 80, 74, 90, 84, 95];
const USERS_DATA    = [120, 145, 138, 160, 175, 190, 185, 210, 200, 230, 220, 245];
const TRAFFIC_DATA  = [800, 950, 870, 1100, 980, 1250, 1180, 1400, 1320, 1500, 1450, 1600];
const ORDERS_DATA   = [18, 24, 20, 30, 26, 35, 32, 40, 37, 45, 42, 50];
const MONTHS        = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const STATS = [
  { label: "Total Revenue", value: "$84,320", change: "+12.5%", up: true,  data: REVENUE_DATA,  accent: "#10b981" },
  { label: "New Users",     value: "24,521",  change: "+8.2%",  up: true,  data: USERS_DATA,    accent: "#3b82f6" },
  { label: "Page Views",    value: "1.6M",    change: "+18.4%", up: true,  data: TRAFFIC_DATA,  accent: "#f59e0b" },
  { label: "Orders",        value: "3,842",   change: "-3.1%",  up: false, data: ORDERS_DATA,   accent: "#ec4899" },
];

const ALL_USERS = [
  { name: "Alice Johnson", email: "alice@co.com", role: "Admin",  status: "Active",   joined: "Jan 12", av: "AJ", color: "#6366f1" },
  { name: "Bob Martinez",  email: "bob@co.com",   role: "Editor", status: "Active",   joined: "Feb 3",  av: "BM", color: "#10b981" },
  { name: "Carol White",   email: "carol@co.com", role: "Viewer", status: "Inactive", joined: "Feb 19", av: "CW", color: "#f59e0b" },
  { name: "David Lee",     email: "david@co.com", role: "Editor", status: "Active",   joined: "Mar 1",  av: "DL", color: "#0ea5e9" },
  { name: "Eva Brown",     email: "eva@co.com",   role: "Viewer", status: "Active",   joined: "Mar 8",  av: "EB", color: "#ec4899" },
  { name: "Frank Kim",     email: "frank@co.com", role: "Admin",  status: "Active",   joined: "Mar 15", av: "FK", color: "#8b5cf6" },
  { name: "Grace Chen",    email: "grace@co.com", role: "Editor", status: "Inactive", joined: "Mar 20", av: "GC", color: "#14b8a6" },
  { name: "Henry Park",    email: "henry@co.com", role: "Viewer", status: "Active",   joined: "Mar 22", av: "HP", color: "#f97316" },
];

const REPORTS = [
  { title: "Q1 Revenue Report",     date: "Mar 31", size: "2.4 MB", type: "PDF",  status: "Ready",      color: "#10b981" },
  { title: "User Growth Analysis",  date: "Mar 28", size: "1.1 MB", type: "XLSX", status: "Ready",      color: "#3b82f6" },
  { title: "Traffic Overview",      date: "Mar 25", size: "890 KB", type: "PDF",  status: "Processing", color: "#f59e0b" },
  { title: "Conversion Funnel",     date: "Mar 20", size: "3.2 MB", type: "PDF",  status: "Ready",      color: "#10b981" },
  { title: "Marketing Performance", date: "Mar 15", size: "1.8 MB", type: "XLSX", status: "Ready",      color: "#3b82f6" },
  { title: "Infrastructure Costs",  date: "Mar 10", size: "560 KB", type: "CSV",  status: "Archived",   color: "#6b7280" },
];

const DONUT_SEGMENTS = [
  { value: 45, color: "#6366f1", label: "Direct" },
  { value: 30, color: "#10b981", label: "Organic" },
  { value: 15, color: "#f59e0b", label: "Referral" },
  { value: 10, color: "#ec4899", label: "Social" },
];

type ActivePage   = "dashboard" | "users" | "reports" | "settings";
type SettingsTab  = "profile" | "security" | "notifications";

// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activePage,   setActivePage]   = useState<ActivePage>("dashboard");
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [searchUsers,  setSearchUsers]  = useState("");
  const [filterRole,   setFilterRole]   = useState("All");
  const [settingsTab,  setSettingsTab]  = useState<SettingsTab>("profile");
  const [notifEmail,   setNotifEmail]   = useState(true);
  const [notifPush,    setNotifPush]    = useState(false);
  const [notifSMS,     setNotifSMS]     = useState(true);
  const [darkMode,     setDarkMode]     = useState(true);
  const [twoFA,        setTwoFA]        = useState(false);

  const navItems = [
    { id: "dashboard" as ActivePage, label: "Dashboard", Icon: DashIcon,     badge: null },
    { id: "users"     as ActivePage, label: "Users",     Icon: UsersIcon,    badge: ALL_USERS.filter(u => u.status === "Active").length },
    { id: "reports"   as ActivePage, label: "Reports",   Icon: ReportIcon,   badge: REPORTS.filter(r => r.status === "Ready").length },
    { id: "settings"  as ActivePage, label: "Settings",  Icon: SettingsIcon, badge: null },
  ];

  const filteredUsers = ALL_USERS.filter(u => {
    const q = searchUsers.toLowerCase();
    return (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      && (filterRole === "All" || u.role === filterRole);
  });

  const userInitials = user.name.split(" ").map(n => n[0]).join("");

  const handleNav = (id: ActivePage) => {
    setActivePage(id);
    setSidebarOpen(false);
  };

  // ── Sidebar inner content ──────────────────────────────────────────────────
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.07]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center font-black text-white text-base flex-shrink-0">
          A
        </div>
        <div>
          <div className="font-extrabold text-sm text-white tracking-tight">AdminPanel</div>
          <div className="text-[10px] text-white/30 mt-0.5">v2.0 Pro</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(({ id, label, Icon, badge }) => {
          const active = activePage === id;
          return (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer ${
                active
                  ? "bg-gradient-to-r from-indigo-500/20 to-sky-500/10 text-white border border-indigo-500/35"
                  : "text-white/40 border border-transparent hover:text-white/60 hover:bg-white/[0.04]"
              }`}
            >
              <Icon size={15} color={active ? "#a5b4fc" : "rgba(255,255,255,0.3)"} />
              <span className="flex-1 text-left">{label}</span>
              {badge !== null && (
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 text-white">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-2 border-t border-white/[0.07]">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.04]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">{user.name}</div>
            <div className="text-[10px] text-white/30 capitalize">{user.role}</div>
          </div>
          <button onClick={onLogout} title="Logout" className="text-white/25 hover:text-red-400 transition-colors p-1 cursor-pointer">
            <LogoutIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="flex min-h-screen bg-[#0d1117] text-white"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      {/* ── MOBILE SIDEBAR OVERLAY ──────────────────────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-[#0d1117] border-r border-white/[0.07] z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── DESKTOP SIDEBAR ─────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex lg:flex-col w-56 min-h-screen sticky top-0 bg-[#0d1117] border-r border-white/[0.07] flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-y-auto">

        {/* Topbar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-7 py-3.5 bg-[#0d1117]/90 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/40 hover:text-white transition-colors p-1 cursor-pointer"
            >
              <MenuIcon size={20} />
            </button>
            <div>
              <div className="font-extrabold text-base md:text-lg tracking-tight capitalize">{activePage}</div>
              <div className="text-[10px] text-white/25 hidden sm:block">{new Date().toDateString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
              🛡️ Admin
            </span>
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-red-400 transition-all cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 md:p-7">

          {/* ════════════ DASHBOARD ════════════ */}
          {activePage === "dashboard" && (
            <div className="flex flex-col gap-5 md:gap-6">

              {/* Welcome */}
              <div className="rounded-2xl px-5 py-4 md:px-6 md:py-5 bg-gradient-to-br from-indigo-500/20 to-sky-500/10 border border-indigo-500/20 flex items-center justify-between">
                <div>
                  <div className="text-lg md:text-xl font-extrabold">Welcome back, {user.name.split(" ")[0]}! 👋</div>
                  <div className="text-xs md:text-sm text-white/40 mt-1">Here's what's happening today.</div>
                </div>
                <div className="text-3xl md:text-4xl hidden sm:block">📊</div>
              </div>

              {/* Stat cards — 2 cols mobile → 4 cols desktop */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {STATS.map((s, i) => (
                  <div key={i} className="rounded-2xl p-4 md:p-[18px] bg-white/[0.03] border border-white/[0.07]">
                    <div className="text-[10px] text-white/35 font-semibold tracking-widest uppercase mb-2">{s.label}</div>
                    <div className="text-xl md:text-2xl font-extrabold mb-1">{s.value}</div>
                    <div className={`text-[11px] font-bold mb-2.5 ${s.up ? "text-emerald-400" : "text-red-400"}`}>
                      {s.up ? "▲" : "▼"} {s.change}
                    </div>
                    <Sparkline data={s.data} color={s.accent} />
                  </div>
                ))}
              </div>

              {/* Charts — stacked mobile → 2/3 + 1/3 desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">

                {/* Bar chart */}
                <div className="lg:col-span-2 rounded-2xl p-4 md:p-5 bg-white/[0.03] border border-white/[0.07]">
                  <div className="flex justify-between items-center mb-4">
                    <div className="font-bold text-sm">Monthly Revenue</div>
                    <div className="text-[11px] text-white/30">2024</div>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    {REVENUE_DATA.map((v, i) => {
                      const maxVal = Math.max(...REVENUE_DATA);
                      const h = Math.max(8, (v / maxVal) * 100);
                      return (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div className="w-full flex items-end" style={{ height: 80 }}>
                            <div
                              className="w-full rounded-t transition-all duration-300"
                              style={{
                                height: `${h}%`,
                                background: i === 11
                                  ? "linear-gradient(180deg,#6366f1,#0ea5e9)"
                                  : "rgba(99,102,241,0.28)",
                              }}
                            />
                          </div>
                          <div className="text-[8px] md:text-[9px] text-white/25">{MONTHS[i]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Donut */}
                <div className="rounded-2xl p-4 md:p-5 bg-white/[0.03] border border-white/[0.07]">
                  <div className="font-bold text-sm mb-4">Traffic Sources</div>
                  <div className="flex flex-col items-center gap-4">
                    <DonutChart segments={DONUT_SEGMENTS} />
                    <div className="w-full flex flex-col gap-2">
                      {DONUT_SEGMENTS.map((seg, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
                            <span className="text-xs text-white/55">{seg.label}</span>
                          </div>
                          <span className="text-xs font-bold">{seg.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent users table */}
              <div className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.07]">
                <div className="flex justify-between items-center px-4 md:px-5 py-3.5 border-b border-white/[0.05]">
                  <div className="font-bold text-sm">Recent Users</div>
                  <button onClick={() => setActivePage("users")} className="text-indigo-400 text-xs font-semibold hover:text-indigo-200 transition-colors cursor-pointer">
                    View all →
                  </button>
                </div>
                {/* horizontal scroll on small screens */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs min-w-[480px]">
                    <thead>
                      <tr className="border-b border-white/[0.04]">
                        {["User", "Role", "Status", "Joined"].map(h => (
                          <th key={h} className="px-4 md:px-5 py-2.5 text-left text-[10px] font-bold text-white/25 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ALL_USERS.slice(0, 5).map((u, i) => (
                        <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 md:px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                                style={{ background: `linear-gradient(135deg,${u.color},${u.color}88)` }}>
                                {u.av}
                              </div>
                              <div>
                                <div className="text-[12px] font-semibold">{u.name}</div>
                                <div className="text-[10px] text-white/30 hidden md:block">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 md:px-5 py-3">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300">
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 md:px-5 py-3">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-emerald-400" : "bg-white/20"}`} />
                              <span className={`text-[11px] ${u.status === "Active" ? "text-emerald-400" : "text-white/30"}`}>{u.status}</span>
                            </div>
                          </td>
                          <td className="px-4 md:px-5 py-3 text-[11px] text-white/35">{u.joined}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════ USERS ════════════ */}
          {activePage === "users" && (
            <div className="flex flex-col gap-5">

              {/* Summary — 2×2 mobile → 4-col desktop */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Total Users", value: ALL_USERS.length,                                     cls: "text-indigo-400" },
                  { label: "Active",      value: ALL_USERS.filter(u => u.status === "Active").length,   cls: "text-emerald-400" },
                  { label: "Inactive",    value: ALL_USERS.filter(u => u.status === "Inactive").length, cls: "text-amber-400" },
                  { label: "Admins",      value: ALL_USERS.filter(u => u.role === "Admin").length,      cls: "text-pink-400" },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl p-4 bg-white/[0.03] border border-white/[0.07]">
                    <div className={`text-2xl md:text-3xl font-extrabold ${s.cls}`}>{s.value}</div>
                    <div className="text-[10px] text-white/35 mt-1 font-semibold uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Toolbar — stacked mobile → row desktop */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40 pointer-events-none">🔍</span>
                  <input
                    value={searchUsers}
                    onChange={e => setSearchUsers(e.target.value)}
                    placeholder="Search users by name or email..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-white/[0.05] border border-white/10 text-white outline-none placeholder:text-white/25"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["All", "Admin", "Editor", "Viewer"].map(r => (
                    <button key={r} onClick={() => setFilterRole(r)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        filterRole === r
                          ? "bg-indigo-500/20 border border-indigo-500/50 text-indigo-300"
                          : "bg-white/[0.03] border border-white/[0.08] text-white/40 hover:text-white/60"
                      }`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users table */}
              <div className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.07]">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs min-w-[580px]">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        {["User", "Email", "Role", "Status", "Joined", "Actions"].map(h => (
                          <th key={h} className="px-4 md:px-5 py-3 text-left text-[10px] font-bold text-white/25 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u, i) => (
                        <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 md:px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                                style={{ background: `linear-gradient(135deg,${u.color},${u.color}66)` }}>
                                {u.av}
                              </div>
                              <span className="text-[12px] font-semibold">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-4 md:px-5 py-3.5 text-[11px] text-white/40">{u.email}</td>
                          <td className="px-4 md:px-5 py-3.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300">
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 md:px-5 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-emerald-400" : "bg-white/20"}`} />
                              <span className={`text-[11px] ${u.status === "Active" ? "text-emerald-400" : "text-white/30"}`}>{u.status}</span>
                            </div>
                          </td>
                          <td className="px-4 md:px-5 py-3.5 text-[11px] text-white/35">{u.joined}</td>
                          <td className="px-4 md:px-5 py-3.5">
                            <div className="flex gap-1.5">
                              <button className="px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer bg-sky-500/10 border border-sky-500/25 text-sky-400 hover:bg-sky-500/20 transition-colors">Edit</button>
                              <button className="px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors">Remove</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-white/25 text-sm">No users match your search.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════ REPORTS ════════════ */}
          {activePage === "reports" && (
            <div className="flex flex-col gap-5">

              {/* Summary — stacked mobile → 3-col desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                {[
                  { label: "Total Reports", value: REPORTS.length,                                      icon: "📄", cls: "text-indigo-400" },
                  { label: "Ready",         value: REPORTS.filter(r => r.status === "Ready").length,    icon: "✅", cls: "text-emerald-400" },
                  { label: "Processing",    value: REPORTS.filter(r => r.status === "Processing").length,icon: "⏳", cls: "text-amber-400" },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl p-4 md:p-5 bg-white/[0.03] border border-white/[0.07] flex items-center gap-4">
                    <div className="text-2xl">{s.icon}</div>
                    <div>
                      <div className={`text-2xl md:text-3xl font-extrabold ${s.cls}`}>{s.value}</div>
                      <div className="text-[10px] text-white/35 font-semibold uppercase tracking-wider mt-0.5">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Report list */}
              <div className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.07]">
                <div className="px-4 md:px-5 py-3.5 border-b border-white/[0.05] font-bold text-sm">All Reports</div>
                {REPORTS.map((r, i) => {
                  const statusCls =
                    r.status === "Ready"      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" :
                    r.status === "Processing" ? "bg-amber-500/15 border-amber-500/30 text-amber-300" :
                                                "bg-zinc-500/20 border-zinc-500/30 text-zinc-400";
                  return (
                    <div key={i} className={`flex items-center gap-3 md:gap-4 px-4 md:px-5 py-4 ${i < REPORTS.length - 1 ? "border-b border-white/[0.04]" : ""}`}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-extrabold flex-shrink-0"
                        style={{ background: `${r.color}20`, border: `1px solid ${r.color}40`, color: r.color }}>
                        {r.type}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold truncate">{r.title}</div>
                        <div className="text-[11px] text-white/30 mt-0.5">{r.date} · {r.size}</div>
                      </div>
                      <span className={`hidden sm:inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${statusCls}`}>
                        {r.status}
                      </span>
                      <button className="px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 transition-colors flex-shrink-0">
                        Download
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════════ SETTINGS ════════════ */}
          {activePage === "settings" && (
            <div className="flex flex-col gap-5">

              {/* Tab pills */}
              <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] w-fit">
                {(["profile", "security", "notifications"] as SettingsTab[]).map(tab => (
                  <button key={tab} onClick={() => setSettingsTab(tab)}
                    className={`px-4 md:px-5 py-2 rounded-lg text-xs md:text-[13px] font-semibold cursor-pointer transition-all capitalize ${
                      settingsTab === tab
                        ? "bg-indigo-500/25 text-white"
                        : "text-white/40 hover:text-white/60"
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>

              {/* ── Profile ── */}
              {settingsTab === "profile" && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl p-5 md:p-6 bg-white/[0.03] border border-white/[0.07]">
                    <div className="font-bold text-sm mb-5">Profile Information</div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-xl font-extrabold text-white flex-shrink-0">
                        {userInitials}
                      </div>
                      <div>
                        <div className="font-bold text-base md:text-lg">{user.name}</div>
                        <div className="text-xs text-white/40 mt-0.5">{user.email}</div>
                        <div className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 capitalize">
                          {user.role}
                        </div>
                      </div>
                    </div>
                    {/* 1-col mobile → 2-col desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      {[
                        { label: "Full Name", value: user.name },
                        { label: "Email",     value: user.email },
                        { label: "Role",      value: user.role },
                        { label: "Timezone",  value: "Asia/Kolkata" },
                      ].map((f, i) => (
                        <div key={i}>
                          <div className="text-[10px] font-semibold text-white/35 mb-1.5 uppercase tracking-widest">{f.label}</div>
                          <input defaultValue={f.value}
                            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white/[0.06] border border-white/10 text-white outline-none" />
                        </div>
                      ))}
                    </div>
                    <button className="mt-5 px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer bg-gradient-to-r from-indigo-500 to-sky-500 text-white border-none">
                      Save Changes
                    </button>
                  </div>

                  <div className="rounded-2xl p-5 bg-white/[0.03] border border-white/[0.07]">
                    <div className="font-bold text-sm mb-4">Appearance</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold">Dark Mode</div>
                        <div className="text-xs text-white/35 mt-0.5">Use dark theme across the dashboard</div>
                      </div>
                      <Toggle value={darkMode} onChange={setDarkMode} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Security ── */}
              {settingsTab === "security" && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl p-5 md:p-6 bg-white/[0.03] border border-white/[0.07]">
                    <div className="font-bold text-sm mb-5">Change Password</div>
                    {["Current Password", "New Password", "Confirm Password"].map((label, i, arr) => (
                      <div key={i} className={i < arr.length - 1 ? "mb-4" : ""}>
                        <div className="text-[10px] font-semibold text-white/35 mb-1.5 uppercase tracking-widest">{label}</div>
                        <input type="password" placeholder="••••••••"
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white/[0.06] border border-white/10 text-white outline-none" />
                      </div>
                    ))}
                    <button className="mt-5 px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer bg-gradient-to-r from-indigo-500 to-sky-500 text-white border-none">
                      Update Password
                    </button>
                  </div>
                  <div className="rounded-2xl p-5 bg-white/[0.03] border border-white/[0.07]">
                    <div className="font-bold text-sm mb-4">Two-Factor Authentication</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold">Enable 2FA</div>
                        <div className="text-xs text-white/35 mt-0.5">Add an extra layer of security to your account</div>
                      </div>
                      <Toggle value={twoFA} onChange={setTwoFA} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Notifications ── */}
              {settingsTab === "notifications" && (
                <div className="rounded-2xl p-5 md:p-6 bg-white/[0.03] border border-white/[0.07]">
                  <div className="font-bold text-sm mb-5">Notification Preferences</div>
                  {[
                    { label: "Email Notifications", desc: "Receive updates via email",   value: notifEmail, set: setNotifEmail },
                    { label: "Push Notifications",  desc: "Browser push notifications",  value: notifPush,  set: setNotifPush },
                    { label: "SMS Notifications",   desc: "Get alerts via text message", value: notifSMS,   set: setNotifSMS },
                  ].map((n, i, arr) => (
                    <div key={i} className={`flex items-center justify-between py-4 ${i < arr.length - 1 ? "border-b border-white/[0.05]" : ""}`}>
                      <div>
                        <div className="text-sm font-semibold">{n.label}</div>
                        <div className="text-xs text-white/35 mt-0.5">{n.desc}</div>
                      </div>
                      <Toggle value={n.value} onChange={n.set} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
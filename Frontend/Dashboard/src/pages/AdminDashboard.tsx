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

// ── Donut chart ───────────────────────────────────────────────────────────────
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
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={a.color}
          strokeWidth="10"
          strokeDasharray={`${a.dash} ${a.gap}`}
          strokeDashoffset={0}
          transform={`rotate(${a.rot} ${cx} ${cy})`}
          strokeLinecap="round"
        />
      ))}
      <circle cx={cx} cy={cy} r={26} fill="#161b27" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const REVENUE_DATA  = [32, 45, 38, 60, 52, 70, 65, 80, 74, 90, 84, 95];
const USERS_DATA    = [120, 145, 138, 160, 175, 190, 185, 210, 200, 230, 220, 245];
const TRAFFIC_DATA  = [800, 950, 870, 1100, 980, 1250, 1180, 1400, 1320, 1500, 1450, 1600];
const ORDERS_DATA   = [18, 24, 20, 30, 26, 35, 32, 40, 37, 45, 42, 50];

const STATS = [
  { label: "Total Revenue",  value: "$84,320", change: "+12.5%", up: true,  data: REVENUE_DATA,  color: "#6ee7b7", accent: "#10b981" },
  { label: "New Users",      value: "24,521",  change: "+8.2%",  up: true,  data: USERS_DATA,    color: "#93c5fd", accent: "#3b82f6" },
  { label: "Page Views",     value: "1.6M",    change: "+18.4%", up: true,  data: TRAFFIC_DATA,  color: "#fcd34d", accent: "#f59e0b" },
  { label: "Orders",         value: "3,842",   change: "-3.1%",  up: false, data: ORDERS_DATA,   color: "#f9a8d4", accent: "#ec4899" },
];

const ALL_USERS = [
  { name: "Alice Johnson",  email: "alice@co.com",  role: "Admin",   status: "Active",   joined: "Jan 12", av: "AJ", color: "#6366f1" },
  { name: "Bob Martinez",   email: "bob@co.com",    role: "Editor",  status: "Active",   joined: "Feb 3",  av: "BM", color: "#10b981" },
  { name: "Carol White",    email: "carol@co.com",  role: "Viewer",  status: "Inactive", joined: "Feb 19", av: "CW", color: "#f59e0b" },
  { name: "David Lee",      email: "david@co.com",  role: "Editor",  status: "Active",   joined: "Mar 1",  av: "DL", color: "#0ea5e9" },
  { name: "Eva Brown",      email: "eva@co.com",    role: "Viewer",  status: "Active",   joined: "Mar 8",  av: "EB", color: "#ec4899" },
  { name: "Frank Kim",      email: "frank@co.com",  role: "Admin",   status: "Active",   joined: "Mar 15", av: "FK", color: "#8b5cf6" },
  { name: "Grace Chen",     email: "grace@co.com",  role: "Editor",  status: "Inactive", joined: "Mar 20", av: "GC", color: "#14b8a6" },
  { name: "Henry Park",     email: "henry@co.com",  role: "Viewer",  status: "Active",   joined: "Mar 22", av: "HP", color: "#f97316" },
];

const REPORTS = [
  { title: "Q1 Revenue Report",       date: "Mar 31", size: "2.4 MB", type: "PDF",   status: "Ready",      color: "#10b981" },
  { title: "User Growth Analysis",    date: "Mar 28", size: "1.1 MB", type: "XLSX",  status: "Ready",      color: "#3b82f6" },
  { title: "Traffic Overview",        date: "Mar 25", size: "890 KB", type: "PDF",   status: "Processing", color: "#f59e0b" },
  { title: "Conversion Funnel",       date: "Mar 20", size: "3.2 MB", type: "PDF",   status: "Ready",      color: "#10b981" },
  { title: "Marketing Performance",   date: "Mar 15", size: "1.8 MB", type: "XLSX",  status: "Ready",      color: "#3b82f6" },
  { title: "Infrastructure Costs",    date: "Mar 10", size: "560 KB", type: "CSV",   status: "Archived",   color: "#6b7280" },
];

const DONUT_SEGMENTS = [
  { value: 45, color: "#6366f1", label: "Direct" },
  { value: 30, color: "#10b981", label: "Organic" },
  { value: 15, color: "#f59e0b", label: "Referral" },
  { value: 10, color: "#ec4899", label: "Social" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─────────────────────────────────────────────────────────────────────────────
// STYLES HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const S = {
  page: {
    display: "flex" as const,
    minHeight: "100vh",
    background: "#0d1117",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: "white",
  },
  sidebar: {
    width: 220,
    minHeight: "100vh",
    position: "sticky" as const,
    top: 0,
    display: "flex" as const,
    flexDirection: "column" as const,
    background: "#0d1117",
    borderRight: "1px solid rgba(255,255,255,0.07)",
    flexShrink: 0,
  },
  main: {
    flex: 1,
    overflowY: "auto" as const,
    minWidth: 0,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activePage, setActivePage] = useState<"dashboard" | "users" | "reports" | "settings">("dashboard");
  const [searchUsers, setSearchUsers] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [settingsTab, setSettingsTab] = useState<"profile" | "security" | "notifications">("profile");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush]   = useState(false);
  const [notifSMS, setNotifSMS]     = useState(true);
  const [darkMode, setDarkMode]     = useState(true);
  const [twoFA, setTwoFA]           = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard",  icon: DashIcon },
    { id: "users",     label: "Users",      icon: UsersIcon,  badge: ALL_USERS.filter(u => u.status === "Active").length },
    { id: "reports",   label: "Reports",    icon: ReportIcon, badge: REPORTS.filter(r => r.status === "Ready").length },
    { id: "settings",  label: "Settings",   icon: SettingsIcon },
  ];

  const filteredUsers = ALL_USERS.filter(u => {
    const q = searchUsers.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = filterRole === "All" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div style={S.page}>

      {/* ── SIDEBAR ────────────────────────────────────────────────────── */}
      <aside style={S.sidebar}>
        {/* Logo */}
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16 }}>A</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: "-0.3px" }}>AdminPanel</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>v2.0 Pro</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {navItems.map(item => {
            const active = activePage === item.id;
            return (
              <button key={item.id} onClick={() => setActivePage(item.id as any)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 10, marginBottom: 2,
                  border: active ? "1px solid rgba(99,102,241,0.35)" : "1px solid transparent",
                  background: active ? "linear-gradient(135deg,rgba(99,102,241,0.22),rgba(14,165,233,0.12))" : "transparent",
                  color: active ? "white" : "rgba(255,255,255,0.38)",
                  cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 400,
                  transition: "all 0.15s",
                }}>
                <item.icon size={16} color={active ? "#a5b4fc" : "rgba(255,255,255,0.3)"} />
                <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
                {item.badge && (
                  <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 20, background: "linear-gradient(135deg,#6366f1,#0ea5e9)", color: "white" }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.04)" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
              {user.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "capitalize" }}>{user.role}</div>
            </div>
            <button onClick={onLogout} title="Logout"
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.25)", padding: 4, display: "flex" }}>
              <LogoutIcon size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ───────────────────────────────────────────────────────── */}
      <main style={S.main}>

        {/* Topbar */}
        <div style={{ position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", background: "rgba(13,17,23,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.4px" }}>
              {activePage.charAt(0).toUpperCase() + activePage.slice(1)}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 1 }}>{new Date().toDateString()}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
              🛡️ Admin
            </span>
            <button onClick={onLogout} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}>
              Logout
            </button>
          </div>
        </div>

        <div style={{ padding: 28 }}>

          {/* ══════════════ DASHBOARD PAGE ══════════════ */}
          {activePage === "dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Welcome */}
              <div style={{ borderRadius: 16, padding: "20px 24px", background: "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(14,165,233,0.1))", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>Welcome back, {user.name.split(" ")[0]}! 👋</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Here's what's happening with your platform today.</div>
                </div>
                <div style={{ fontSize: 40 }}>📊</div>
              </div>

              {/* Stat cards with sparklines */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                {STATS.map((s, i) => (
                  <div key={i} style={{ borderRadius: 14, padding: "18px 18px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>{s.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{s.value}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: s.up ? "#34d399" : "#f87171", marginBottom: 10 }}>
                      {s.up ? "▲" : "▼"} {s.change} vs last month
                    </div>
                    <Sparkline data={s.data} color={s.accent} />
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>

                {/* Bar chart – monthly revenue */}
                <div style={{ borderRadius: 14, padding: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Monthly Revenue</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>2024</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 4 }}>
                    {REVENUE_DATA.map((v, i) => {
                      const max = Math.max(...REVENUE_DATA);
                      const h = Math.max(8, (v / max) * 100);
                      return (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <div style={{ width: "100%", height: 100, display: "flex", alignItems: "flex-end" }}>
                            <div style={{ width: "100%", height: `${h}%`, borderRadius: "4px 4px 0 0", background: i === 11 ? "linear-gradient(180deg,#6366f1,#0ea5e9)" : "rgba(99,102,241,0.28)", transition: "height 0.3s" }} />
                          </div>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>{MONTHS[i]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Donut – traffic source */}
                <div style={{ borderRadius: 14, padding: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Traffic Sources</div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                    <DonutChart segments={DONUT_SEGMENTS} />
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
                      {DONUT_SEGMENTS.map((seg, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: seg.color }} />
                            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{seg.label}</span>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700 }}>{seg.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent users mini table */}
              <div style={{ borderRadius: 14, overflow: "hidden", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Recent Users</div>
                  <button onClick={() => setActivePage("users")} style={{ background: "none", border: "none", cursor: "pointer", color: "#818cf8", fontSize: 12, fontWeight: 600 }}>View all →</button>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      {["User", "Role", "Status", "Joined"].map(h => (
                        <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ALL_USERS.slice(0, 5).map((u, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <td style={{ padding: "12px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${u.color},${u.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>{u.av}</div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "12px 20px" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", color: "#a5b4fc" }}>{u.role}</span>
                        </td>
                        <td style={{ padding: "12px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: u.status === "Active" ? "#34d399" : "rgba(255,255,255,0.2)" }} />
                            <span style={{ fontSize: 12, color: u.status === "Active" ? "#34d399" : "rgba(255,255,255,0.3)" }}>{u.status}</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 20px", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{u.joined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════ USERS PAGE ══════════════ */}
          {activePage === "users" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
                {[
                  { label: "Total Users",    value: ALL_USERS.length,                              color: "#6366f1" },
                  { label: "Active",         value: ALL_USERS.filter(u => u.status==="Active").length,   color: "#10b981" },
                  { label: "Inactive",       value: ALL_USERS.filter(u => u.status==="Inactive").length, color: "#f59e0b" },
                  { label: "Admins",         value: ALL_USERS.filter(u => u.role==="Admin").length,      color: "#ec4899" },
                ].map((s, i) => (
                  <div key={i} style={{ borderRadius: 12, padding: "16px 18px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Toolbar */}
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <input
                    value={searchUsers}
                    onChange={e => setSearchUsers(e.target.value)}
                    placeholder="Search users by name or email..."
                    style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px 10px 36px", borderRadius: 10, fontSize: 13, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none" }}
                  />
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, opacity: 0.4 }}>🔍</span>
                </div>
                {["All","Admin","Editor","Viewer"].map(r => (
                  <button key={r} onClick={() => setFilterRole(r)}
                    style={{ padding: "9px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: filterRole === r ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.08)", background: filterRole === r ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)", color: filterRole === r ? "#a5b4fc" : "rgba(255,255,255,0.4)" }}>
                    {r}
                  </button>
                ))}
              </div>

              {/* Full users table */}
              <div style={{ borderRadius: 14, overflow: "hidden", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {["User", "Email", "Role", "Status", "Joined", "Actions"].map(h => (
                        <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg,${u.color},${u.color}66)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{u.av}</div>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 20px", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{u.email}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", color: "#a5b4fc" }}>{u.role}</span>
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: u.status === "Active" ? "#34d399" : "rgba(255,255,255,0.2)" }} />
                            <span style={{ fontSize: 12, color: u.status === "Active" ? "#34d399" : "rgba(255,255,255,0.3)" }}>{u.status}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 20px", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{u.joined}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button style={{ padding: "5px 12px", borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: "pointer", background: "rgba(14,165,233,0.12)", border: "1px solid rgba(14,165,233,0.25)", color: "#38bdf8" }}>Edit</button>
                            <button style={{ padding: "5px 12px", borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: "pointer", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>No users match your search.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════ REPORTS PAGE ══════════════ */}
          {activePage === "reports" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Summary cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {[
                  { label: "Total Reports", value: REPORTS.length,                                  icon: "📄", color: "#6366f1" },
                  { label: "Ready",         value: REPORTS.filter(r=>r.status==="Ready").length,    icon: "✅", color: "#10b981" },
                  { label: "Processing",    value: REPORTS.filter(r=>r.status==="Processing").length,icon: "⏳", color: "#f59e0b" },
                ].map((s, i) => (
                  <div key={i} style={{ borderRadius: 12, padding: "18px 20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ fontSize: 28 }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reports list */}
              <div style={{ borderRadius: 14, overflow: "hidden", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontWeight: 700, fontSize: 14 }}>All Reports</div>
                {REPORTS.map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderBottom: i < REPORTS.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${r.color}20`, border: `1px solid ${r.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: r.color, flexShrink: 0 }}>
                      {r.type}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{r.date} · {r.size}</div>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                      background: r.status === "Ready" ? "rgba(16,185,129,0.15)" : r.status === "Processing" ? "rgba(245,158,11,0.15)" : "rgba(107,114,128,0.2)",
                      border: `1px solid ${r.status === "Ready" ? "rgba(16,185,129,0.3)" : r.status === "Processing" ? "rgba(245,158,11,0.3)" : "rgba(107,114,128,0.3)"}`,
                      color: r.status === "Ready" ? "#34d399" : r.status === "Processing" ? "#fcd34d" : "#9ca3af",
                    }}>
                      {r.status}
                    </span>
                    <button style={{ padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════ SETTINGS PAGE ══════════════ */}
          {activePage === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Tabs */}
              <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 12, background: "rgba(255,255,255,0.04)", width: "fit-content" }}>
                {(["profile","security","notifications"] as const).map(tab => (
                  <button key={tab} onClick={() => setSettingsTab(tab)}
                    style={{ padding: "8px 20px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", background: settingsTab === tab ? "rgba(99,102,241,0.25)" : "transparent", color: settingsTab === tab ? "white" : "rgba(255,255,255,0.4)", textTransform: "capitalize" }}>
                    {tab}
                  </button>
                ))}
              </div>

              {/* Profile tab */}
              {settingsTab === "profile" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ borderRadius: 14, padding: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 20 }}>Profile Information</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                      <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg,#6366f1,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800 }}>
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{user.name}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{user.email}</div>
                        <div style={{ fontSize: 11, marginTop: 6, padding: "2px 10px", borderRadius: 20, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc", display: "inline-block", fontWeight: 700, textTransform: "capitalize" }}>{user.role}</div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      {[
                        { label: "Full Name", value: user.name },
                        { label: "Email",     value: user.email },
                        { label: "Role",      value: user.role },
                        { label: "Timezone",  value: "Asia/Kolkata" },
                      ].map((f, i) => (
                        <div key={i}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</div>
                          <input defaultValue={f.value} style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", borderRadius: 9, fontSize: 13, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none", textTransform: f.label === "Role" ? "capitalize" : "none" }} />
                        </div>
                      ))}
                    </div>
                    <button style={{ marginTop: 20, padding: "10px 24px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "linear-gradient(135deg,#6366f1,#0ea5e9)", border: "none", color: "white" }}>
                      Save Changes
                    </button>
                  </div>

                  {/* Appearance */}
                  <div style={{ borderRadius: 14, padding: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Appearance</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>Dark Mode</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Use dark theme across the dashboard</div>
                      </div>
                      <Toggle value={darkMode} onChange={setDarkMode} />
                    </div>
                  </div>
                </div>
              )}

              {/* Security tab */}
              {settingsTab === "security" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ borderRadius: 14, padding: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 20 }}>Change Password</div>
                    {["Current Password","New Password","Confirm Password"].map((label, i) => (
                      <div key={i} style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                        <input type="password" placeholder="••••••••" style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", borderRadius: 9, fontSize: 13, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none" }} />
                      </div>
                    ))}
                    <button style={{ marginTop: 6, padding: "10px 24px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "linear-gradient(135deg,#6366f1,#0ea5e9)", border: "none", color: "white" }}>
                      Update Password
                    </button>
                  </div>

                  <div style={{ borderRadius: 14, padding: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Two-Factor Authentication</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>Enable 2FA</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Add an extra layer of security to your account</div>
                      </div>
                      <Toggle value={twoFA} onChange={setTwoFA} />
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications tab */}
              {settingsTab === "notifications" && (
                <div style={{ borderRadius: 14, padding: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 20 }}>Notification Preferences</div>
                  {[
                    { label: "Email Notifications",  desc: "Receive updates via email",         value: notifEmail, set: setNotifEmail },
                    { label: "Push Notifications",   desc: "Browser push notifications",        value: notifPush,  set: setNotifPush },
                    { label: "SMS Notifications",    desc: "Get alerts via text message",       value: notifSMS,   set: setNotifSMS },
                  ].map((n, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{n.label}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{n.desc}</div>
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

// ─── Toggle switch ────────────────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 12, background: value ? "linear-gradient(135deg,#6366f1,#0ea5e9)" : "rgba(255,255,255,0.12)", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
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
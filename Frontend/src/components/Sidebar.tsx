import type { AuthUser } from "../types";
import { LogoutIcon, CloseIcon } from "./Icons";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  navItems: NavItem[];
  page: string;
  setPage: (id: string) => void;
  user: AuthUser;
  onLogout: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function Sidebar({
  navItems, page, setPage, user, onLogout, onClose, isMobile,
}: SidebarProps) {
  // Safe name initials — handles missing or short names
  const initials = (user.name ?? user.email ?? "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col h-full bg-white">

      {/* Logo */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
            {user.role === "Admin" ? "A" : "₹"}
          </div>
          <div>
            <div className="text-slate-800 font-bold text-sm">Nickname-Infotech</div>
            <div className="text-slate-400 text-xs capitalize">{user.role} panel</div>
          </div>
        </div>
        {isMobile && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <CloseIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ id, label, icon: NavIcon }) => {
          const active = page === id;
          return (
            <button
              key={id}
              onClick={() => { setPage(id); onClose?.(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                active
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <NavIcon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-slate-800 text-xs font-bold truncate">{user.name ?? user.email}</div>
            <div className="text-slate-400 text-xs capitalize">{user.role}</div>
          </div>
          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
            title="Logout"
          >
            <LogoutIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
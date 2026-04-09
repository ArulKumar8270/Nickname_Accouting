import { useState } from "react";
import type { AuthUser } from "../types";
import Sidebar from "./Sidebar";
import { MenuIcon, LogoutIcon } from "./Icons";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardLayoutProps {
  navItems: NavItem[];
  page: string;
  setPage: (id: string) => void;
  user: AuthUser;
  onLogout: () => void;
  title: string;
  children: React.ReactNode;
}

export default function DashboardLayout({
  navItems, page, setPage, user, onLogout, title, children,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-56 flex-col border-r border-slate-200 flex-shrink-0 sticky top-0 h-screen shadow-sm">
        <Sidebar
          navItems={navItems}
          page={page}
          setPage={setPage}
          user={user}
          onLogout={onLogout}
        />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden border-r border-slate-200 shadow-xl">
            <Sidebar
              navItems={navItems}
              page={page}
              setPage={setPage}
              user={user}
              onLogout={onLogout}
              onClose={() => setMobileOpen(false)}
              isMobile
            />
          </aside>
        </>
      )}

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">

        {/* Topbar */}
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-slate-500 hover:text-slate-800 transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <div>
              <div className="text-slate-800 font-bold text-base">{title}</div>
              <div className="text-slate-400 text-xs hidden sm:block">{new Date().toDateString()}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold">
              ● Books Open
            </span>
            <button
              onClick={onLogout}
              className="hidden sm:flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition-colors px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white"
            >
              <LogoutIcon className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </div>

      </main>
    </div>
  );
}
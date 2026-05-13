import { useState } from "react";
import type { AuthUser } from "../types";
import type { AdminPage } from "../types";
import DashboardLayout from "../components/DashboardLayout";
import {
  HomeIcon, InvoiceIcon, UsersIcon, ChartIcon, SettingsIcon,
} from "../components/Icons";

// Split pages
import OverviewPage  from "./Overview/OverviewPage";
import InvoicePage   from "./Invoices/InvoicePage";
import UsersPage     from "./Users/UsersPage";
import ReportsPage   from "./Reports/ReportsPage";
import SettingsPage  from "./Settings/SettingsPage";

interface AdminDashboardProps {
  user: AuthUser;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { id: "overview",  label: "Overview",  icon: HomeIcon     },
  { id: "invoices",  label: "Invoices",  icon: InvoiceIcon  },
  { id: "users",     label: "Users",     icon: UsersIcon    },
  { id: "reports",   label: "Reports",   icon: ChartIcon    },
  { id: "settings",  label: "Settings",  icon: SettingsIcon },
];

const PAGE_TITLES: Record<AdminPage, string> = {
  overview: "Admin Overview",
  invoices: "Invoices",
  users:    "User Management",
  reports:  "Reports",
  settings: "Settings",
};

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [page, setPage] = useState<AdminPage>("overview");

  return (
    <DashboardLayout
      navItems={NAV_ITEMS}
      page={page}
      setPage={(id) => setPage(id as AdminPage)}
      user={user}
      onLogout={onLogout}
      title={PAGE_TITLES[page]}
    >
      {page === "overview"  && <OverviewPage  user={user} />}
      {page === "invoices"  && <InvoicePage   />}
      {page === "users"     && <UsersPage     />}
      {page === "reports"   && <ReportsPage   invoices={[]} />}
      {page === "settings"  && <SettingsPage  user={user} />}
    </DashboardLayout>
  );
}
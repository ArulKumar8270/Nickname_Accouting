import { useState } from "react";
import type { AuthUser, UserPage } from "../types";
import DashboardLayout from "../components/DashboardLayout";
import {
  HomeIcon, InvoiceIcon, DollarIcon, ShieldIcon, ActivityIcon,
} from "../components/Icons";

// Split pages
import UserOverviewPage  from "./UserOverview/UserOverviewPage";
import UserInvoicesPage  from "./UserInvoices/UserInvoicesPage";
import ExpensesPage      from "./Expenses/ExpensesPage";
import GSTPage           from "./GST/GSTPage";
import ActivityPage      from "./Activity/ActivityPage";

interface UserDashboardProps {
  user:     AuthUser;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",  icon: HomeIcon     },
  { id: "invoices",  label: "Invoices",   icon: InvoiceIcon  },
  { id: "expenses",  label: "Expenses",   icon: DollarIcon   },
  { id: "gst",       label: "GST Filing", icon: ShieldIcon   },
  { id: "activity",  label: "Activity",   icon: ActivityIcon },
];

const PAGE_TITLES: Record<UserPage, string> = {
  dashboard: "Dashboard",
  invoices:  "Invoices",
  expenses:  "Expenses",
  gst:       "GST Filing",
  activity:  "Activity",
};

export default function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const [page, setPage] = useState<UserPage>("dashboard");

  return (
    <DashboardLayout
      navItems={NAV_ITEMS}
      page={page}
      setPage={(id) => setPage(id as UserPage)}
      user={user}
      onLogout={onLogout}
      title={PAGE_TITLES[page]}
    >
      {page === "dashboard" && <UserOverviewPage user={user} />}
      {page === "invoices"  && <UserInvoicesPage />}
      {page === "expenses"  && <ExpensesPage />}
      {page === "gst"       && <GSTPage />}
      {page === "activity"  && <ActivityPage user={user} />}
    </DashboardLayout>
  );
}
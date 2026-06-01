import { useState } from "react";
import type { AuthUser } from "./types";

import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard  from "./pages/UserDashboard";
import LoginPage      from "./pages/LoginPage";

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);

  const handleLogin = (u: AuthUser) => {
    const normalized: AuthUser = {
      ...u,
      role: (u.role?.toLowerCase() === "admin" ? "Admin" : "User") as "Admin" | "User",
    };
    setUser(normalized);
  };

  const handleLogout = () => setUser(null);

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (user.role === "Admin") {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  return <UserDashboard user={user} onLogout={handleLogout} />;
}
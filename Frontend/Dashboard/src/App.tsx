import { useState } from "react";
import type { AuthUser, Page } from "./types";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [user, setUser] = useState<AuthUser | null>(null);

  const handleLogin = (loggedInUser: AuthUser) => {
    setUser(loggedInUser);
    setPage(loggedInUser.role === "admin" ? "admin" : "user");
  };

  const handleLogout = () => {
    setUser(null);
    setPage("login");
  };

  if (page === "login")               return <LoginPage onLogin={handleLogin} />;
  if (page === "admin" && user)       return <AdminDashboard user={user} onLogout={handleLogout} />;
  if (page === "user"  && user)       return <UserDashboard  user={user} onLogout={handleLogout} />;
  return <LoginPage onLogin={handleLogin} />;
}
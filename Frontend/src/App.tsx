import { useState } from "react";
import type { AuthUser } from "./types";
import { store } from "./store/authSlice";
import { login, logout } from "./store/authSlice";
import LoginPage      from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard  from "./pages/UserDashboard";

interface AppState {
  user: AuthUser | null;
  isLoggedIn: boolean;
}

export default function App() {
  const [authState, setAuthState] = useState<AppState>({
    user: null,
    isLoggedIn: false,
  });

  const handleLogin = (user: AuthUser) => {
    // Redux Toolkit — global store update
    store.dispatch(login(user));
    // Local state — trigger re-render
    setAuthState({ user, isLoggedIn: true });
  };

  const handleLogout = () => {
    store.dispatch(logout());
    setAuthState({ user: null, isLoggedIn: false });
  };

  if (!authState.isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (authState.user?.role === "admin") {
    return <AdminDashboard user={authState.user} onLogout={handleLogout} />;
  }

  return <UserDashboard user={authState.user!} onLogout={handleLogout} />;
}
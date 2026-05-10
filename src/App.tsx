import { useSelector } from "react-redux";
import type { RootState } from "./store/store";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const { isLoggedIn, role } = useSelector((s: RootState) => s.auth);

  
  if (isLoggedIn && role === "admin") return (
  <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
    <h1 className="text-3xl font-bold">Welcome Admin! 👑</h1>
  </div>
);

if (isLoggedIn && role === "user") return (
  <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
    <h1 className="text-3xl font-bold">Welcome User! 👋</h1>
  </div>
);
  return <LoginPage />;
}
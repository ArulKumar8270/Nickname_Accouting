import { useState } from "react";
import type { AuthUser } from "../types";
import { CREDENTIALS } from "../constants/credentials";

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = () => {
    setError("");
    if (!username || !password) { setError("Please enter username and password."); return; }
    const match = CREDENTIALS.find(
      (c) => c.username === username.toLowerCase() && c.password === password
    );
    if (!match) { setError("Invalid username or password!"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(match.user); }, 1000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(160deg, #0f2f55 0%, #1a5799 40%, #2989d8 70%, #1e5799 100%)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 384, height: 384, borderRadius: "50%", opacity: 0.1, top: -80, left: -80, background: "radial-gradient(circle, #ffffff, transparent)" }} />
        <div style={{ position: "absolute", width: 288, height: 288, borderRadius: "50%", opacity: 0.1, bottom: -40, right: -40, background: "radial-gradient(circle, #7ec8e3, transparent)" }} />
      </div>

      <div style={{
        position: "relative", width: "100%", maxWidth: 380, margin: "0 16px",
        borderRadius: 20, boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
        background: "linear-gradient(180deg, rgba(25,80,160,0.75) 0%, rgba(15,50,110,0.92) 100%)",
        backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.15)", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }} />

        <div style={{ padding: "40px 32px 32px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <div style={{
              width: 96, height: 96, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.06))",
              border: "3px solid rgba(255,255,255,0.25)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}>
              <svg width="54" height="54" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.65)" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="rgba(255,255,255,0.65)" />
              </svg>
            </div>
          </div>

          {error && (
            <div style={{ marginBottom: 16, padding: "10px 16px", borderRadius: 12, fontSize: 12, textAlign: "center", fontWeight: 600, background: "rgba(220,50,50,0.2)", border: "1px solid rgba(220,50,50,0.35)", color: "#fca5a5" }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ position: "relative", marginBottom: 12 }}>
            <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,0.45)" strokeWidth="2"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", boxSizing: "border-box", paddingLeft: 40, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderRadius: 12, fontSize: 14, outline: "none", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", color: "white", caretColor: "white" }}
            />
          </div>

          <div style={{ position: "relative", marginBottom: 20 }}>
            <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="rgba(255,255,255,0.45)" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="rgba(255,255,255,0.45)" strokeWidth="2"/>
              </svg>
            </div>
            <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", boxSizing: "border-box", paddingLeft: 40, paddingRight: 40, paddingTop: 12, paddingBottom: 12, borderRadius: 12, fontSize: 14, outline: "none", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", color: "white", caretColor: "white" }}
            />
            <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex" }}>
              {showPass
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setRemember(!remember)}>
              <div style={{ width: 16, height: 16, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", background: remember ? "rgba(100,180,255,0.85)" : "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)" }}>
                {remember && <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>Remember me</span>
            </label>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.55)", fontSize: 12 }}>Forgot Password?</button>
          </div>

          <button onClick={handleLogin} disabled={loading}
            style={{ width: "100%", padding: "12px 0", borderRadius: 12, fontWeight: 700, fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", background: "linear-gradient(135deg, rgba(80,140,220,0.7), rgba(50,100,190,0.85))", border: "1px solid rgba(255,255,255,0.22)", color: "white", opacity: loading ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, textAlign: "center", letterSpacing: "0.1em", marginBottom: 8 }}>DEMO CREDENTIALS</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setUsername("admin"); setPassword("admin123"); setError(""); }}
                style={{ flex: 1, padding: "8px 0", borderRadius: 12, fontSize: 11, fontWeight: 700, cursor: "pointer", background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)", color: "#a5b4fc" }}>
                🔐 Admin Login
              </button>
              <button onClick={() => { setUsername("user"); setPassword("user123"); setError(""); }}
                style={{ flex: 1, padding: "8px 0", borderRadius: 12, fontSize: 11, fontWeight: 700, cursor: "pointer", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", color: "#6ee7b7" }}>
                👤 User Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
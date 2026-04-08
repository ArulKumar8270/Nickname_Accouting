import { useState } from "react";
import { useForm } from "react-hook-form";
import type { AuthUser } from "../types";
import { CREDENTIALS } from "../constants/credentials";
import { EyeIcon, EyeOffIcon, UserIcon, LockIcon, AlertIcon } from "../components/Icons";

interface LoginPageProps {
onLogin: (user: AuthUser) => void;
}

interface LoginFormValues {
username: string;
password: string;
remember: boolean;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
const [showPass, setShowPass] = useState(false);
const [loading, setLoading]   = useState(false);
const [loginError, setLoginError] = useState("");

const {
register,
handleSubmit,
setValue,
formState: { errors },
} = useForm<LoginFormValues>({
defaultValues: { username: "", password: "", remember: false },
});

const onSubmit = (data: LoginFormValues) => {
setLoginError("");
const match = CREDENTIALS.find(
(c) => c.username === data.username.toLowerCase().trim() && c.password === data.password
);
if (!match) { setLoginError("Invalid username or password!"); return; }
setLoading(true);
setTimeout(() => { setLoading(false); onLogin(match.user); }, 1000);
};

const fillDemo = (type: "admin" | "user") => {
setValue("username", type);
setValue("password", type === "admin" ? "admin123" : "user123");
setLoginError("");
};

return (
<div
className="min-h-screen flex items-center justify-center relative overflow-hidden"
style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0f4c81 70%, #0c2d54 100%)" }}
>
{/* Background blobs */}
<div className="absolute inset-0 overflow-hidden pointer-events-none">
<div className="absolute w-96 h-96 rounded-full opacity-10 -top-20 -left-20"
style={{ background: "radial-gradient(circle, #60a5fa, transparent)" }} />
<div className="absolute w-72 h-72 rounded-full opacity-10 -bottom-10 -right-10"
style={{ background: "radial-gradient(circle, #34d399, transparent)" }} />
</div>

<div className="relative w-full max-w-sm mx-4">  
    <div  
      className="rounded-2xl overflow-hidden"  
      style={{  
        background: "rgba(15,30,60,0.85)",  
        backdropFilter: "blur(24px)",  
        border: "1px solid rgba(255,255,255,0.12)",  
        boxShadow: "0 30px 80px rgba(0,0,0,0.5)",  
      }}  
    >  
      {/* Top shimmer line */}  
      <div className="h-px w-full"  
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }} />  

      <div className="p-8">  
        {/* Avatar */}  
        <div className="flex justify-center mb-6">  
          <div  
            className="w-20 h-20 rounded-full flex items-center justify-center"  
            style={{  
              background: "linear-gradient(135deg, rgba(96,165,250,0.25), rgba(52,211,153,0.15))",  
              border: "2px solid rgba(255,255,255,0.2)",  
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",  
            }}  
          >  
            <svg className="w-10 h-10 opacity-70" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)">  
              <circle cx="12" cy="8" r="4" />  
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />  
            </svg>  
          </div>  
        </div>  

        <h1 className="text-center text-white font-bold text-xl mb-1">Welcome Back</h1>  
        <p className="text-center text-blue-300 text-xs mb-6 opacity-70">Sign in to your account</p>  

        {/* Server-side error */}  
        {loginError && (  
          <div  
            className="mb-4 px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold"  
            style={{ background: "rgba(220,38,38,0.2)", border: "1px solid rgba(220,38,38,0.4)", color: "#fca5a5" }}  
          >  
            <AlertIcon /> {loginError}  
          </div>  
        )}  

        {/* ── React Hook Form ── */}  
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">  
          {/* Username */}  
          <div>  
            <div className="relative">  
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 opacity-50">  
                <UserIcon />  
              </span>  
              <input  
                {...register("username", { required: "Username is required" })}  
                placeholder="Username"  
                autoComplete="username"  
                className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-blue-300/50 outline-none transition-all"  
                style={{  
                  background: "rgba(255,255,255,0.08)",  
                  border: errors.username  
                    ? "1px solid rgba(252,165,165,0.6)"  
                    : "1px solid rgba(255,255,255,0.15)",  
                  caretColor: "white",  
                }}  
              />  
            </div>  
            {errors.username && (  
              <p className="mt-1 text-xs text-red-400 pl-1">{errors.username.message}</p>  
            )}  
          </div>  

          {/* Password */}  
          <div>  
            <div className="relative">  
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 opacity-50">  
                <LockIcon />  
              </span>  
              <input  
                {...register("password", {  
                  required: "Password is required",  
                  minLength: { value: 6, message: "Min 6 characters" },  
                })}  
                type={showPass ? "text" : "password"}  
                placeholder="Password"  
                autoComplete="current-password"  
                className="w-full pl-9 pr-10 py-3 rounded-xl text-sm text-white placeholder-blue-300/50 outline-none transition-all"  
                style={{  
                  background: "rgba(255,255,255,0.08)",  
                  border: errors.password  
                    ? "1px solid rgba(252,165,165,0.6)"  
                    : "1px solid rgba(255,255,255,0.15)",  
                  caretColor: "white",  
                }}  
              />  
              <button  
                type="button"  
                onClick={() => setShowPass(!showPass)}  
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 opacity-50 hover:opacity-100 transition-opacity"  
              >  
                {showPass ? <EyeOffIcon /> : <EyeIcon />}  
              </button>  
            </div>  
            {errors.password && (  
              <p className="mt-1 text-xs text-red-400 pl-1">{errors.password.message}</p>  
            )}  
          </div>  

          {/* Remember + Forgot */}  
          <div className="flex items-center justify-between py-1">  
            <label className="flex items-center gap-2 cursor-pointer">  
              <input  
                {...register("remember")}  
                type="checkbox"  
                className="w-3.5 h-3.5 rounded accent-blue-500"  
              />  
              <span className="text-xs text-blue-300 opacity-60">Remember me</span>  
            </label>  
            <button type="button" className="text-xs text-blue-400 opacity-70 hover:opacity-100 transition-opacity">  
              Forgot Password?  
            </button>  
          </div>  

          {/* Submit */}  
          <button  
            type="submit"  
            disabled={loading}  
            className="w-full py-3 rounded-xl font-bold text-sm tracking-widest uppercase text-white transition-all"  
            style={{  
              background: loading  
                ? "rgba(96,165,250,0.4)"  
                : "linear-gradient(135deg, rgba(96,165,250,0.7), rgba(59,130,246,0.85))",  
              border: "1px solid rgba(255,255,255,0.2)",  
              cursor: loading ? "not-allowed" : "pointer",  
            }}  
          >  
            {loading ? (  
              <span className="flex items-center justify-center gap-2">  
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">  
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />  
                  <path d="M12 2a10 10 0 0110 10" strokeLinecap="round" />  
                </svg>  
                Signing in...  
              </span>  
            ) : "Login"}  
          </button>  
        </form>  

        {/* Demo Credentials */}  
        <div className="mt-5 pt-4 border-t border-white/10">  
          <p className="text-center text-xs text-blue-300 opacity-30 tracking-widest uppercase mb-3">  
            Demo Credentials  
          </p>  
          <div className="flex gap-2">  
            <button  
              onClick={() => fillDemo("admin")}  
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90"  
              style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)", color: "#a5b4fc" }}  
            >  
              🔐 Admin  
            </button>  
            <button  
              onClick={() => fillDemo("user")}  
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90"  
              style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", color: "#6ee7b7" }}  
            >  
              👤 User  
            </button>  
          </div>  
        </div>  
      </div>  
    </div>  
  </div>  
</div>

);
}

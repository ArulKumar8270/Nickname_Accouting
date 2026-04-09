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
  const [loadingRole, setLoadingRole] = useState<"admin" | "user" | null>(null);
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { username: "", password: "", remember: false },
  });

  const handleRoleLogin = (role: "admin" | "user") => {
    handleSubmit((data) => {
      setLoginError("");

      const match = CREDENTIALS.find(
        (c) =>
          c.username === data.username.toLowerCase().trim() &&
          c.password === data.password &&
          c.user.role === role  // role match பண்ணணும்
      );

      if (!match) {
        setLoginError(
          role === "admin"
            ? "Invalid admin credentials!"
            : "Invalid user credentials!"
        );
        return;
      }

      setLoadingRole(role);
      setTimeout(() => {
        setLoadingRole(null);
        onLogin(match.user);
      }, 1000);
    })();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full bg-blue-600 opacity-5 -top-20 -left-20 blur-3xl" />
        <div className="absolute w-72 h-72 rounded-full bg-violet-600 opacity-5 -bottom-10 -right-10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">

          {/* Top stripe */}
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

          <div className="p-8">
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </div>
            </div>

            <h1 className="text-center text-white font-bold text-xl mb-1">Welcome Back</h1>
            <p className="text-center text-slate-400 text-sm mb-6">Sign in to your account</p>

            {/* Error */}
            {loginError && (
              <div className="mb-4 px-3 py-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold bg-red-950 border border-red-800 text-red-400">
                <AlertIcon className="w-4 h-4 flex-shrink-0" />
                {loginError}
              </div>
            )}

            <form className="space-y-4">

              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <UserIcon className="w-4 h-4" />
                  </span>
                  <input
                    {...register("username", { required: "Username is required" })}
                    placeholder="Enter your username"
                    autoComplete="username"
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all border ${
                      errors.username
                        ? "border-red-700 bg-red-950 focus:ring-2 focus:ring-red-900"
                        : "border-slate-700 bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-900"
                    }`}
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-xs text-red-400 pl-1">{errors.username.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <LockIcon className="w-4 h-4" />
                  </span>
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" },
                    })}
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all border ${
                      errors.password
                        ? "border-red-700 bg-red-950 focus:ring-2 focus:ring-red-900"
                        : "border-slate-700 bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-900"
                    }`}
                  />
                  {/* showPass=false → hidden → EyeIcon */}
                  {/* showPass=true  → visible → EyeOffIcon */}
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPass((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPass ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400 pl-1">{errors.password.message}</p>
                )}
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register("remember")}
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded accent-blue-500"
                  />
                  <span className="text-xs text-slate-400">Remember me</span>
                </label>
                <button type="button" className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Forgot Password?
                </button>
              </div>

              {/* Admin Login + User Login buttons */}
              <div className="flex gap-2 pt-1">
                {/* Admin Login — admin credentials மட்டும் accept பண்ணும் */}
                <button
                  type="button"
                  disabled={loadingRole !== null}
                  onClick={() => handleRoleLogin("admin")}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {loadingRole === "admin" ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                        <path d="M12 2a10 10 0 0110 10" strokeLinecap="round" />
                      </svg>
                      Loading...
                    </>
                  ) : "🔐 Admin Login"}
                </button>

                {/* User Login — user credentials மட்டும் accept பண்ணும் */}
                <button
                  type="button"
                  disabled={loadingRole !== null}
                  onClick={() => handleRoleLogin("user")}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {loadingRole === "user" ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                        <path d="M12 2a10 10 0 0110 10" strokeLinecap="round" />
                      </svg>
                      Loading...
                    </>
                  ) : "👤 User Login"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
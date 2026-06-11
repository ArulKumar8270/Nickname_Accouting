import { useState } from "react";
import { useForm } from "react-hook-form";
import { authApi } from "../services/api";
import type { AuthUser } from "../types";

type FormData = {
  name?:           string;
  emailOrUsername: string;
  password:        string;
};

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister,   setIsRegister]   = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const handleSuccess = (user: { name?: string; email: string; role: string }) => {
    const role = user.role?.toLowerCase() === "admin" ? "Admin" : "User";
    onLogin({ name: user.name ?? user.email, email: user.email, role } as AuthUser);
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (isRegister) {
        const user = await authApi.register(
          data.name ?? data.emailOrUsername.split("@")[0],
          data.emailOrUsername,
          data.password
        );
        handleSuccess(user);
      } else {
        const user = await authApi.login(data.emailOrUsername, data.password);
        handleSuccess(user);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Something went wrong";
      setError("password", { message: msg });
    }
  };

  const toggle = () => { setIsRegister((p) => !p); reset(); };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 shadow-2xl shadow-black/50">

          <div className="mb-8">
            <h1 className="text-white text-2xl font-bold">
              {isRegister ? "Create Account" : "Sign in"}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {isRegister ? "Register to continue" : "Sign in to continue"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {isRegister && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                  Full Name
                </label>
                <input
                  {...register("name")}
                  placeholder="Enter your name"
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                Email
              </label>
              <input
                {...register("emailOrUsername", { required: "Email is required" })}
                placeholder="Enter email"
                autoComplete="off"
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
              {errors.emailOrUsername && (
                <p className="text-pink-400 text-xs mt-1.5">{errors.emailOrUsername.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Password is required" })}
                  placeholder="Enter password"
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 pr-12 text-slate-100 placeholder-slate-600 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-pink-400 text-xs mt-1.5 font-medium">
                  ⚠ {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 shadow-lg shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 transition-all duration-150 text-sm tracking-wide"
            >
              {isSubmitting ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
            </button>

            <p className="text-center text-slate-500 text-xs">
              {isRegister ? "Already have an account?" : "Don't have an account?"}
              {" "}
              <button type="button" onClick={toggle} className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                {isRegister ? "Sign In" : "Register"}
              </button>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}
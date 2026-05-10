import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../store/authSlice";

type FormData = {
  emailOrUsername: string;
  password: string;
};

export default function LoginPage() {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/login`, {
        email: data.emailOrUsername,
        password: data.password,
      });

      const user = response.data;
      dispatch(login({ username: user.email, role: user.role }));

    } catch (error) {
      setError("password", { message: "Invalid credentials" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      {/* Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 shadow-2xl shadow-black/50">

          {/* Header */}
          <div className="mb-8">
           
            <p className="text-slate-500  text-2xl mt-1">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {/* Email or Username */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                Email or Username
              </label>
              <input
                {...register("emailOrUsername", { required: "Email or Username is required" })}
                placeholder="Enter email or username"
                autoComplete="off"
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
              {errors.emailOrUsername && (
                <p className="text-pink-400 text-xs mt-1.5 font-medium">
                  ⚠ {errors.emailOrUsername.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                Password
              </label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                placeholder="Enter password"
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
              {errors.password && (
                <p className="text-pink-400 text-xs mt-1.5 font-medium">
                  ⚠ {errors.password.message}
                </p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 shadow-lg shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 text-sm tracking-wide"
            >
              Sign In →
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
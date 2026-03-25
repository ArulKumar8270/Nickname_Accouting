import { useState } from "react";
import type { AuthUser } from "../types";

interface UserDashboardProps {
  user: AuthUser;
  onLogout: () => void;
}

interface Task {
  title: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  done: boolean;
}

const INITIAL_TASKS: Task[] = [
  { title: "Review Q2 report",         due: "Today",    priority: "High",   done: false },
  { title: "Update profile settings",  due: "Tomorrow", priority: "Low",    done: true  },
  { title: "Submit timesheet",         due: "Mar 28",   priority: "Medium", done: false },
  { title: "Join team standup",        due: "Today",    priority: "High",   done: true  },
  { title: "Prepare project proposal", due: "Apr 2",    priority: "Medium", done: false },
];

const PRIORITY_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  High:   { bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)",   text: "#fca5a5" },
  Medium: { bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)",  text: "#fcd34d" },
  Low:    { bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)",  text: "#6ee7b7" },
};

export default function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const completed = tasks.filter((t) => t.done).length;
  const progress  = Math.round((completed / tasks.length) * 100);

  const toggleTask = (index: number) => {
    setTasks((prev) => prev.map((t, i) => i === index ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="min-h-screen" style={{ background: "#f0fdf9", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-8 py-4 shadow-sm"
        style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid #d1fae5" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-sm"
            style={{ background: "linear-gradient(135deg,#10b981,#0ea5e9)" }}>U</div>
          <span className="text-gray-800 font-black text-base">UserPanel</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#059669" }}>
            👤 User
          </span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white"
              style={{ background: "linear-gradient(135deg,#10b981,#0ea5e9)" }}>SR</div>
            <span className="text-gray-700 text-xs font-semibold">{user.name}</span>
          </div>
          <button onClick={onLogout}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 bg-white text-gray-400 hover:text-red-500 hover:border-red-200 transition-all">
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-5">
        {/* Welcome Banner */}
        <div className="rounded-3xl px-7 py-6 text-white shadow-lg relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#10b981,#0ea5e9)" }}>
          <div className="absolute right-0 top-0 bottom-0 w-40 opacity-10"
            style={{ background: "radial-gradient(circle at 80% 50%, white, transparent)" }} />
          <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mb-1">
            {new Date().toDateString()}
          </p>
          <h2 className="text-2xl font-black mb-1">Hello, {user.name.split(" ")[0]}! 🌿</h2>
          <p className="text-emerald-50/80 text-sm">
            You have <strong>{tasks.filter((t) => !t.done).length} pending tasks</strong> today.
          </p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-700 font-bold text-sm">Task Progress</h3>
            <span className="text-emerald-600 font-black text-sm">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg,#10b981,#0ea5e9)" }} />
          </div>
          <p className="text-gray-400 text-[11px] mt-1">{completed} of {tasks.length} completed</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Tasks Done",    value: `${completed}/${tasks.length}`, icon: "✓", color: "#10b981" },
            { label: "Messages",      value: "8",  icon: "✉", color: "#0ea5e9" },
            { label: "Notifications", value: "5",  icon: "🔔", color: "#f59e0b" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3"
                style={{ background: `${s.color}18`, color: s.color }}>{s.icon}</div>
              <p className="text-gray-800 text-xl font-black">{s.value}</p>
              <p className="text-gray-400 text-[10px] uppercase tracking-widest font-semibold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Task List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid #f9fafb" }}>
            <h3 className="text-gray-800 font-black text-sm">My Tasks</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(16,185,129,0.1)", color: "#059669" }}>
              {tasks.filter((t) => !t.done).length} pending
            </span>
          </div>
          {tasks.map((task, i) => (
            <div
              key={i}
              onClick={() => toggleTask(i)}
              className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-gray-50/60 transition-colors"
              style={{ borderBottom: "1px solid #f9fafb", opacity: task.done ? 0.55 : 1 }}
            >
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                style={{ borderColor: task.done ? "#10b981" : "#d1d5db", background: task.done ? "#10b981" : "transparent" }}>
                {task.done && (
                  <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                    <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-medium ${task.done ? "line-through text-gray-400" : "text-gray-700"}`}>
                  {task.title}
                </p>
                <p className="text-gray-400 text-[10px] mt-0.5">Due: {task.due}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  background: PRIORITY_STYLES[task.priority].bg,
                  border: `1px solid ${PRIORITY_STYLES[task.priority].border}`,
                  color: PRIORITY_STYLES[task.priority].text,
                }}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
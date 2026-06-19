import { TrendingIcon } from "./Icons";

type Accent = "blue" | "emerald" | "amber" | "red" | "violet";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent: Accent;
}

const accentMap: Record<Accent, { wrap: string; icon: string; val: string }> = {
  blue:    { wrap: "bg-blue-50 border-blue-200",    icon: "bg-blue-100 text-blue-600",    val: "text-blue-700"    },
  emerald: { wrap: "bg-emerald-50 border-emerald-200", icon: "bg-emerald-100 text-emerald-600", val: "text-emerald-700" },
  amber:   { wrap: "bg-amber-50 border-amber-200",  icon: "bg-amber-100 text-amber-600",  val: "text-amber-700"   },
  red:     { wrap: "bg-red-50 border-red-200",      icon: "bg-red-100 text-red-600",      val: "text-red-700"     },
  violet:  { wrap: "bg-violet-50 border-violet-200",icon: "bg-violet-100 text-violet-600",val: "text-violet-700"  },
};

export default function StatCard({ icon, label, value, sub, accent }: StatCardProps) {
  const { wrap, icon: iconCls, val } = accentMap[accent];
  return (
    <div className={`rounded-xl p-4 border ${wrap}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${iconCls}`}>{icon}</div>
        <TrendingIcon className="w-4 h-4 text-slate-400" />
      </div>
      <div className={`text-2xl font-extrabold mb-1 ${val}`}>{value}</div>
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}
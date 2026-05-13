interface BadgeProps {
  status: string;
}

const statusMap: Record<string, string> = {
  Paid:     "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Active:   "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Filed:    "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Pending:  "bg-amber-100 text-amber-700 border border-amber-200",
  Sent:     "bg-blue-100 text-blue-700 border border-blue-200",
  Draft:    "bg-slate-100 text-slate-600 border border-slate-200",
  Inactive: "bg-amber-100 text-amber-700 border border-amber-200",
  Overdue:  "bg-red-100 text-red-700 border border-red-200",
  admin:    "bg-violet-100 text-violet-700 border border-violet-200",
  user:     "bg-blue-100 text-blue-700 border border-blue-200",
};

export default function Badge({ status }: BadgeProps) {
  const cls = statusMap[status] ?? "bg-slate-100 text-slate-600 border border-slate-200";
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${cls}`}>
      {status}
    </span>
  );
}
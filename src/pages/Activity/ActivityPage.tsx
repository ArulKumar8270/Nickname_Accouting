import { useState, useEffect, useCallback } from "react";
import type { Activity } from "../../types/user";
import type { AuthUser } from "../../types";
import { activityApi } from "../../services/userApi";

interface ActivityPageProps {
  user: AuthUser;
}

export default function ActivityPage({ user }: ActivityPageProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading,    setLoading]    = useState(false);

  /* ── GET /api/user/activity ── */
  const fetchActivity = useCallback(async () => {
    setLoading(true);
    try {
      const data = await activityApi.getAll();
      setActivities(data);
    } catch (err) {
      console.error("Fetch activity failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchActivity(); }, [fetchActivity]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-slate-800 font-bold text-sm">Recent Activity — {user.name}</h3>
        </div>
        {loading && (
          <p className="px-5 py-8 text-center text-slate-400 text-sm">Loading...</p>
        )}
        <div className="divide-y divide-slate-100">
          {!loading && activities.map((a, i) => (
            <div key={i} className="px-5 py-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors">
              <span className="text-lg mt-0.5">{a.icon}</span>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${a.color}`}>{a.text}</p>
                <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
          {!loading && activities.length === 0 && (
            <p className="px-5 py-8 text-center text-slate-400 text-sm">No activity found</p>
          )}
        </div>
      </div>
    </div>
  );
}
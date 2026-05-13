import { useState } from "react";
import type { AuthUser } from "../../types";
import Badge from "../../components/Badge";
import axios from "axios";

const inputCls =
  "w-full px-3 py-2.5 rounded-xl text-sm text-slate-800 outline-none border border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all";

interface SettingsPageProps {
  user: AuthUser;
}

const COMPANY_FIELDS: { label: string; key: string; defaultValue: string }[] = [
  { label: "Company Name", key: "companyName", defaultValue: "Nexus Technologies Pvt Ltd" },
  { label: "GSTIN",        key: "gstin",       defaultValue: "29AABCN1234A1Z5"            },
  { label: "PAN",          key: "pan",          defaultValue: "AABCN1234A"                 },
  { label: "Fiscal Year",  key: "fiscalYear",   defaultValue: "April 1"                    },
];

export default function SettingsPage({ user }: SettingsPageProps) {
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(COMPANY_FIELDS.map((f) => [f.key, f.defaultValue]))
  );

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  /* ── PUT /api/settings ── */
  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.patch("http://localhost:5000/api/settings/1", form);
      setSaved(true);
    } catch (err) {
      console.error("Settings save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-xl">
      {/* Company Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-slate-800 font-bold mb-4">Company Info</h3>
        <div className="space-y-3">
          {COMPANY_FIELDS.map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                {label}
              </label>
              <input
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className={inputCls}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-all"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {saved && (
            <span className="text-emerald-600 text-xs font-semibold">✓ Saved</span>
          )}
        </div>
      </div>

      {/* Logged-in user */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-slate-800 font-bold mb-1">Logged in as</h3>
        <p className="text-slate-500 text-sm">
          {user.name} ·{" "}
          <span className="text-blue-600 font-medium">{user.email}</span>
        </p>
        <div className="mt-3">
          <Badge status={user.role} />
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect, useCallback } from "react";
import type { AppUser } from "../../types";
import { userApi } from "../../services/api";
import Badge from "../../components/Badge";
import ConfirmDeleteModal from "../../components/Modals/ConfirmDeleteModal";
import UserFormModal from "./UserFormModal";

export default function UsersPage() {
  const [users, setUsers]           = useState<AppUser[]>([]);
  const [loading, setLoading]       = useState(false);
  const [showAdd, setShowAdd]       = useState(false);
  const [editTarget, setEditTarget] = useState<AppUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null);

  /* ── GET all users ── */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userApi.getAll(); // GET /api/users
      setUsers(data);
    } catch (err) {
      console.error("Fetch users failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* ── PATCH toggle status ── */
  const handleToggleStatus = async (id: string) => {
    try {
      await userApi.toggleStatus(id); // PATCH /api/users/:id/toggle-status
      fetchUsers();
    } catch (err) {
      console.error("Toggle status failed:", err);
    }
  };

  /* ── DELETE ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await userApi.remove(deleteTarget.id); // DELETE /api/users/:id
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      console.error("Delete user failed:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-slate-800 font-bold">All Users</h3>
          <p className="text-slate-400 text-xs">
            {users.length} total · {users.filter((u) => u.status === "Active").length} active
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all"
        >
          + Add User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {loading && (
          <p className="px-5 py-8 text-center text-slate-400 text-sm">Loading...</p>
        )}
        {!loading && users.length === 0 && (
          <p className="px-5 py-8 text-center text-slate-400 text-sm">No users found</p>
        )}
        <div className="divide-y divide-slate-100">
          {!loading &&
            users.map((u) => (
              <div
                key={u.id}
                className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {u.name.split(" ").map((n) => n[0]).join("")}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-slate-800 font-semibold text-sm">{u.name}</div>
                  <div className="text-slate-400 text-xs">{u.email}</div>
                </div>

                {/* Badges */}
                <div className="hidden sm:flex items-center gap-2">
                  <Badge status={u.role} />
                  <Badge status={u.status} />
                </div>

                {/* Joined */}
                <div className="text-xs text-slate-400 hidden md:block">{u.joined}</div>

                {/* Actions */}
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    onClick={() => handleToggleStatus(u.id)}
                    className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
                      u.status === "Active"
                        ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    }`}
                  >
                    {u.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => setEditTarget(u)}
                    className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-slate-300 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(u)}
                    className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modals */}
      {showAdd && (
        <UserFormModal
          onClose={() => setShowAdd(false)}
          onSuccess={fetchUsers}
        />
      )}
      {editTarget && (
        <UserFormModal
          initial={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={fetchUsers}
        />
      )}
      {deleteTarget && (
        <ConfirmDeleteModal
          label={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
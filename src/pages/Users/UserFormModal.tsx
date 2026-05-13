import { useForm } from "react-hook-form";
import type { AppUser, UserRole, UserStatus } from "../../types";
import { userApi } from "../../services/api";
import { CommonModal } from "../../components/Modals/CommonModal";
import InputField from "../../components/BaseComponents/InputField";

const inputCls =
  "w-full px-3 py-2.5 rounded-xl text-sm text-slate-800 outline-none border border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all";

interface UserFormValues {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

interface UserFormModalProps {
  initial?: AppUser;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserFormModal({
  initial,
  onClose,
  onSuccess,
}: UserFormModalProps) {
  const isEdit = !!initial;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    defaultValues: {
      name:   initial?.name   ?? "",
      email:  initial?.email  ?? "",
      role:   initial?.role   ?? "User",
      status: initial?.status ?? "Active",
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      if (isEdit && initial) {
        // PUT /api/users/:id
        await userApi.update(initial.id, data);
      } else {
        // POST /api/users
        await userApi.create(data);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("User save failed:", err);
    }
  };

  return (
    <CommonModal title={isEdit ? "Edit User" : "Add User"} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField label="Full Name" error={errors.name?.message}>
          <input
            {...register("name", { required: "" })}
            className={inputCls}
            placeholder="e.g. Priya Sharma"
          />
        </InputField>

        <InputField label="Email" error={errors.email?.message}>
          <input
            {...register("email", {
              required: "Email ",
              pattern: { value: /\S+@\S+\.\S+/, message: "email " },
            })}
            type="email"
            className={inputCls}
            placeholder="e.g. priya@nexus.in"
          />
        </InputField>

        <InputField label="Role">
          <select {...register("role")} className={inputCls}>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </InputField>

        <InputField label="Status">
          <select {...register("status")} className={inputCls}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </InputField>

        <div className="flex gap-3 justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-all"
          >
            {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Add User"}
          </button>
        </div>
      </form>
    </CommonModal>
  );
}
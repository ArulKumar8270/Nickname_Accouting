import { CommonModal } from "./CommonModal";

interface ConfirmDeleteModalProps {
  label: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({
  label,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <CommonModal title="Confirm Delete" onClose={onCancel}>
      <p className="text-slate-600 text-sm mb-6">
        Delete{" "}
        <span className="font-bold text-slate-800">{label}</span>? This cannot
        be undone.
      </p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-all"
        >
          Delete
        </button>
      </div>
    </CommonModal>
  );
}
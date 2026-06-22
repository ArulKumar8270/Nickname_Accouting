import { useForm } from "react-hook-form";
import type { Expense, ExpenseStatus } from "../../types/user";
import { expenseApi } from "../../services/userApi";
import { CommonModal } from "../../components/Modals/CommonModal";
import InputField from "../../components/BaseComponents/InputField";

const inputCls =
  "w-full px-3 py-2.5 rounded-xl text-sm text-slate-800 outline-none border border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all";

const today = () =>
  new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

interface ExpenseFormValues {
  category: string;
  vendor:   string;
  date:     string;
  amount:   number;
  status:   ExpenseStatus;
}

interface Props {
  initial?:  Expense;
  onClose:   () => void;
  onSuccess: () => void;
}

export default function ExpenseFormModal({ initial, onClose, onSuccess }: Props) {
  const isEdit = !!initial;

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<ExpenseFormValues>({
      defaultValues: {
        category: initial?.category ?? "",
        vendor:   initial?.vendor   ?? "",
        date:     initial?.date     ?? today(),
        amount:   initial?.amount   ?? (0 as number),
        status:   initial?.status   ?? "Pending",
      },
    });

  const onSubmit = async (data: ExpenseFormValues) => {
    const payload = { ...data, amount: Number(data.amount) };
    try {
      if (isEdit && initial) {
        await expenseApi.update(initial.id, payload); // PUT /api/user/expenses/:id
      } else {
        await expenseApi.create(payload);             // POST /api/user/expenses
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Expense save failed:", err);
    }
  };

  return (
    <CommonModal title={isEdit ? "Edit Expense" : "Add Expense"} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <InputField label="Category" error={errors.category?.message}>
          <input
            {...register("category", { required: "Category is required" })}
            className={inputCls}
            placeholder="e.g. Office Rent"
          />
        </InputField>

        <InputField label="Vendor" error={errors.vendor?.message}>
          <input
            {...register("vendor", { required: "Vendor name is required" })}
            className={inputCls}
            placeholder="e.g. Krishna Properties"
          />
        </InputField>

        <InputField label="Date" error={errors.date?.message}>
          <input
            {...register("date", { required: "Date is required" })}
            className={inputCls}
            placeholder="e.g. Apr 21"
          />
        </InputField>

        <InputField label="Amount (₹)" error={errors.amount?.message}>
          <input
            {...register("amount", {
              required:      "Amount is required",
              min: { value: 1, message: "Amount must be greater than 0" },
              valueAsNumber: true,
            })}
            type="number"
            className={inputCls}
            placeholder="e.g. 35000"
          />
        </InputField>

        <InputField label="Status">
          <select {...register("status")} className={inputCls}>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </InputField>

        <div className="flex gap-3 justify-end pt-1">
          <button type="button" onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-all">
            {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Add Expense"}
          </button>
        </div>
      </form>
    </CommonModal>
  );
}
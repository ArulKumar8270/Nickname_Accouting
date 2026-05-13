import { useForm } from "react-hook-form";
import type { Invoice, InvoiceStatus } from "../../types";
import { invoiceApi } from "../../services/api";
import { CommonModal } from "../../components/Modals/CommonModal";
import InputField from "../../components/BaseComponents/InputField";

const inputCls =
  "w-full px-3 py-2.5 rounded-xl text-sm text-slate-800 outline-none border border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all";

interface InvoiceFormValues {
  vendor: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
}

interface InvoiceFormModalProps {
  initial?: Invoice;
  onClose: () => void;
  onSuccess: () => void; // parent re-fetch trigger
}

export default function InvoiceFormModal({
  initial,
  onClose,
  onSuccess,
}: InvoiceFormModalProps) {
  const isEdit = !!initial;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormValues>({
    defaultValues: {
      vendor: initial?.vendor ?? "",
      date:
        initial?.date ??
        new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
      amount: initial?.amount ?? (0 as number),
      status: initial?.status ?? "Pending",
    },
  });

  const onSubmit = async (data: InvoiceFormValues) => {
    const payload = { ...data, amount: Number(data.amount) };
    try {
      if (isEdit && initial) {
        // PUT /api/invoices/:id
        await invoiceApi.update(initial.id, payload);
      } else {
        // POST /api/invoices
        await invoiceApi.create(payload);
      }
      onSuccess(); // parent re-fetches → list updates
      onClose();
    } catch (err) {
      console.error("Invoice save failed:", err);
    }
  };

  return (
    <CommonModal title={isEdit ? "Edit Invoice" : "New Invoice"} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField label="Vendor" error={errors.vendor?.message}>
          <input
            {...register("vendor", { required: "Vendor " })}
            className={inputCls}
            placeholder="e.g. AWS India"
          />
        </InputField>

        <InputField label="Date" error={errors.date?.message}>
          <input
            {...register("date", { required: "Date" })}
            className={inputCls}
            placeholder="e.g. Apr 16"
          />
        </InputField>

        <InputField label="Amount (₹)" error={errors.amount?.message}>
          <input
            {...register("amount", {
              required: "Amount ",
              min: { value: 1, message: "0" },
              valueAsNumber: true,
            })}
            type="number"
            className={inputCls}
            placeholder="e.g. 12500"
          />
        </InputField>

        <InputField label="Status">
          <select {...register("status")} className={inputCls}>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
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
            {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Invoice"}
          </button>
        </div>
      </form>
    </CommonModal>
  );
}
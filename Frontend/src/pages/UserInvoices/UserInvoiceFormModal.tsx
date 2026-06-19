import { useForm } from "react-hook-form";
import type { UserInvoice, InvoiceStatus } from "../../types/user";
import { userInvoiceApi } from "../../services/userApi";
import { CommonModal } from "../../components/Modals/CommonModal";
import InputField from "../../components/BaseComponents/InputField";

const inputCls =
  "w-full px-3 py-2.5 rounded-xl text-sm text-slate-800 outline-none border border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all";

const today = () =>
  new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

interface InvoiceFormValues {
  customer: string;
  date:     string;
  amount:   number;
  status:   InvoiceStatus;
}

interface Props {
  initial?:  UserInvoice;
  onClose:   () => void;
  onSuccess: () => void;
}

export default function UserInvoiceFormModal({ initial, onClose, onSuccess }: Props) {
  const isEdit = !!initial;

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<InvoiceFormValues>({
      defaultValues: {
        customer: initial?.customer ?? "",
        date:     initial?.date     ?? today(),
        amount:   initial?.amount   ?? (0 as number),
        status:   initial?.status   ?? "Pending",
      },
    });

  const onSubmit = async (data: InvoiceFormValues) => {
    const payload = { ...data, amount: Number(data.amount) };
    try {
      if (isEdit && initial) {
        await userInvoiceApi.update(initial.id, payload); // PUT /api/user/invoices/:id
      } else {
        await userInvoiceApi.create(payload);             // POST /api/user/invoices
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Invoice save failed:", err);
    }
  };

  return (
    <CommonModal title={isEdit ? "Edit Invoice" : "New Invoice"} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <InputField label="Customer" error={errors.customer?.message}>
          <input
            {...register("customer", { required: "Customer name is required" })}
            className={inputCls}
            placeholder="e.g. Rajesh Traders"
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
            placeholder="e.g. 45000"
          />
        </InputField>

        <InputField label="Status">
          <select {...register("status")} className={inputCls}>
            <option value="Pending">Pending</option>
            <option value="Sent">Sent</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Draft">Draft</option>
          </select>
        </InputField>

        <div className="flex gap-3 justify-end pt-1">
          <button type="button" onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-all">
            {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Invoice"}
          </button>
        </div>
      </form>
    </CommonModal>
  );
}
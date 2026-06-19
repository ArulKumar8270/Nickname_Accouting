const mongoose = require("mongoose");

const gstFilingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    form: { type: String, required: true }, // e.g. "GSTR-3B", "GSTR-1"
    period: { type: String, required: true }, // e.g. "Mar 2024"
    dueDate: { type: Date },
    filedDate: { type: Date },
    status: {
      type: String,
      enum: ["Pending", "Overdue", "Paid"],
      default: "Pending",
    },
    outputGst: { type: Number, default: 0 },
    inputItc: { type: Number, default: 0 },
    netPayable: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One record per form+period per user
gstFilingSchema.index({ user: 1, form: 1, period: 1 }, { unique: true });

module.exports = mongoose.model("GSTFiling", gstFilingSchema);
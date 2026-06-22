const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  vendor:  { type: String, required: true },
  date:    { type: String, required: true },
  amount:  { type: Number, required: true },
  status:  { type: String, enum: ["Pending", "Paid", "Overdue"], default: "Pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
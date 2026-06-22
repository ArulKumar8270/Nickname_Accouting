const mongoose = require("mongoose");

const userInvoiceSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  date:     { type: String, required: true },
  amount:   { type: Number, required: true },
  status:   { type: String, enum: ["Pending", "Paid", "Overdue", "Sent", "Draft"], default: "Pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("UserInvoice", userInvoiceSchema);
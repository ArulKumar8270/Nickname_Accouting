const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  category:  { type: String, required: true },
  vendor:    { type: String, required: true },
  date:      { type: String, required: true },
  amount:    { type: Number, required: true },
  status:    { type: String, enum: ["Pending", "Paid"], default: "Pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);
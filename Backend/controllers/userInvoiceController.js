const UserInvoice = require("../models/UserInvoice");

// GET /api/user-invoices
const getUserInvoices = async (req, res) => {
  try {
    const invoices = await UserInvoice.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/user-invoices
const createUserInvoice = async (req, res) => {
  const { customer, date, amount, status } = req.body;
  try {
    const invoice = await UserInvoice.create({ customer, date, amount, status, createdBy: req.user._id });
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/user-invoices/:id
const updateUserInvoice = async (req, res) => {
  try {
    const invoice = await UserInvoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/user-invoices/:id/pay
const payUserInvoice = async (req, res) => {
  try {
    const invoice = await UserInvoice.findByIdAndUpdate(req.params.id, { status: "Paid" }, { new: true });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/user-invoices/:id
const deleteUserInvoice = async (req, res) => {
  try {
    const invoice = await UserInvoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json({ message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserInvoices, createUserInvoice, updateUserInvoice, payUserInvoice, deleteUserInvoice };
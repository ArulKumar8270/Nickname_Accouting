const Expense = require("../models/Expense");

// GET /api/expenses
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/expenses
const createExpense = async (req, res) => {
  const { category, vendor, date, amount, status } = req.body;
  try {
    const expense = await Expense.create({ category, vendor, date, amount, status, createdBy: req.user._id });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/expenses/:id
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/expenses/:id/pay
const payExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, { status: "Paid" }, { new: true });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getExpenses, createExpense, updateExpense, payExpense, deleteExpense };
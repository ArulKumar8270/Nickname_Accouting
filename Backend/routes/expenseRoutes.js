const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getExpenses, createExpense, updateExpense, payExpense, deleteExpense,
} = require("../controllers/expenseController");

router.get("/",           protect, getExpenses);
router.post("/",          protect, createExpense);
router.put("/:id",        protect, updateExpense);
router.patch("/:id/pay",  protect, payExpense);
router.delete("/:id",     protect, deleteExpense);

module.exports = router;
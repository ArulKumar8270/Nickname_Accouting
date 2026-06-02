const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getUserInvoices, createUserInvoice, updateUserInvoice, payUserInvoice, deleteUserInvoice,
} = require("../controllers/userInvoiceController");

router.get("/",           protect, getUserInvoices);
router.post("/",          protect, createUserInvoice);
router.put("/:id",        protect, updateUserInvoice);
router.patch("/:id/pay",  protect, payUserInvoice);
router.delete("/:id",     protect, deleteUserInvoice);

module.exports = router;
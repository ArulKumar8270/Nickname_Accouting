const express = require("express");
const router  = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getInvoices, createInvoice, updateInvoice, payInvoice, deleteInvoice,
} = require("../controllers/invoiceController");

router.get("/",        protect, adminOnly, getInvoices);
router.post("/",       protect, adminOnly, createInvoice);
router.put("/:id",     protect, adminOnly, updateInvoice);
router.patch("/:id/pay", protect, adminOnly, payInvoice);
router.delete("/:id",  protect, adminOnly, deleteInvoice);

module.exports = router;
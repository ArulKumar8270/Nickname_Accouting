const express = require("express");
const router  = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getInvoices, createInvoice, updateInvoice, payInvoice, deleteInvoice,
} = require("../controllers/invoiceController");

router.get("/",                  protect, adminOnly, async (req, res) => { res.json(await Invoice.find().sort({ createdAt: -1 })); });
router.post("/",                 protect, adminOnly, async (req, res) => { res.status(201).json(await Invoice.create({ ...req.body, createdBy: req.user._id })); });
router.put("/:id",              protect, adminOnly, async (req, res) => { const d = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true }); d ? res.json(d) : res.status(404).json({ message: "Not found" }); });
router.patch("/:id/pay",        protect, adminOnly, async (req, res) => { const d = await Invoice.findByIdAndUpdate(req.params.id, { status: "Paid" }, { new: true }); d ? res.json(d) : res.status(404).json({ message: "Not found" }); });
router.delete("/:id",           protect, adminOnly, async (req, res) => { await Invoice.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); });

module.exports = router;
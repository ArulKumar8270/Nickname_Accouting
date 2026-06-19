const express     = require("express");
const router      = express.Router();
const UserInvoice = require("../models/UserInvoice"); 
const { protect } = require("../middleware/authMiddleware");

router.get("/",          protect, async (req, res) => { try { res.json(await UserInvoice.find({ createdBy: req.user._id }).sort({ createdAt: -1 })); } catch (err) { res.status(500).json({ message: err.message }); } });
router.post("/",         protect, async (req, res) => { try { res.status(201).json(await UserInvoice.create({ ...req.body, createdBy: req.user._id })); } catch (err) { res.status(500).json({ message: err.message }); } });
router.put("/:id",       protect, async (req, res) => { try { const d = await UserInvoice.findByIdAndUpdate(req.params.id, req.body, { new: true }); d ? res.json(d) : res.status(404).json({ message: "Not found" }); } catch (err) { res.status(500).json({ message: err.message }); } });
router.patch("/:id/pay", protect, async (req, res) => { try { const d = await UserInvoice.findByIdAndUpdate(req.params.id, { status: "Paid" }, { new: true }); d ? res.json(d) : res.status(404).json({ message: "Not found" }); } catch (err) { res.status(500).json({ message: err.message }); } });
router.delete("/:id",    protect, async (req, res) => { try { await UserInvoice.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (err) { res.status(500).json({ message: err.message }); } });

module.exports = router;
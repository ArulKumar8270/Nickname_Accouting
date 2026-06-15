const express  = require("express");
const router   = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getSettings, updateSettings } = require("../controllers/settingsController");

router.get("/",      protect, adminOnly, getSettings);
router.patch("/:id", protect, adminOnly, updateSettings);

module.exports = router;
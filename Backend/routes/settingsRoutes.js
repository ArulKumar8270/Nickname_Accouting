const express = require("express");
const router  = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getSettings, updateSettings } = require("../controllers/settingsController");

// GET /api/settings
router.get("/", protect, adminOnly, getSettings);

// PATCH /api/settings/:id
router.patch("/:id", protect, adminOnly, updateSettings);

module.exports = router;
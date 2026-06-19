const express = require("express");
const { getActivity } = require("../controllers/activityController");
const { protect } = require("../middleware/authMiddleware"); // adjust path if your auth middleware lives elsewhere

const router = express.Router();

router.get("/", protect, getActivity);

module.exports = router;
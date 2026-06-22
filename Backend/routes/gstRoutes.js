const express = require("express");
const { getGSTFilings, fileGST } = require("../controllers/gstController");
const { protect } = require("../middleware/authMiddleware"); // adjust path if your auth middleware lives elsewhere

const router = express.Router();

router.get("/", protect, getGSTFilings);
router.post("/file", protect, fileGST);

module.exports = router;
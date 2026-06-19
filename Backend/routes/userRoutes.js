const express = require("express");
const router  = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getUsers, createUser, updateUser, toggleUserStatus, deleteUser,
} = require("../controllers/userController");

// GET /api/users
router.get("/", protect, adminOnly, getUsers);

// POST /api/users
router.post("/", protect, adminOnly, createUser);

// PUT /api/users/:id
router.put("/:id", protect, adminOnly, updateUser);

// PATCH /api/users/:id/toggle-status
router.patch("/:id/toggle-status", protect, adminOnly, toggleUserStatus);

// DELETE /api/users/:id
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
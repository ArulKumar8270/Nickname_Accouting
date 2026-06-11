const express = require("express");
const router  = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getUsers, createUser, updateUser, toggleUserStatus, deleteUser,
} = require("../controllers/userController");

router.get("/",                  protect, adminOnly, getUsers);
router.post("/",                 protect, adminOnly, createUser);
router.put("/:id",               protect, adminOnly, updateUser);
router.patch("/:id/toggle-status", protect, adminOnly, toggleUserStatus);
router.delete("/:id",            protect, adminOnly, deleteUser);

module.exports = router;
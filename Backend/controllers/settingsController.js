const Settings = require("../models/Settings");

// GET /api/settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ createdBy: req.user._id });
    if (!settings) {
      settings = await Settings.create({ createdBy: req.user._id });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/settings/:id
const updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!settings) return res.status(404).json({ message: "Settings not found" });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSettings, updateSettings };
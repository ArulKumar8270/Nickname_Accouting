const Activity = require("../models/activityModel");

const formatRelativeTime = (date) => {
  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// @desc    Get recent activity for the logged-in user
// @route   GET /api/activity
// @access  Private
const getActivity = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const limit = Number(req.query.limit) || 50;
    const activities = await Activity.find({ user: userId }).sort({ createdAt: -1 }).limit(limit);

    res.json(
      activities.map((a) => ({
        icon: a.icon,
        text: a.text,
        color: a.color,
        time: formatRelativeTime(a.createdAt),
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch activity", error: error.message });
  }
};

module.exports = { getActivity };
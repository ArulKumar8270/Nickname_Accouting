const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    icon: { type: String, required: true }, // emoji shown in the feed, e.g. "✅"
    text: { type: String, required: true }, // e.g. "Filed GSTR-3B for Mar 2024"
    color: { type: String, default: "text-slate-700" }, // Tailwind text color class
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

activitySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Activity", activitySchema);
const GSTFiling = require("../models/gstModel");
const Activity = require("../models/activityModel");

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";

// Shapes a DB record into exactly what GSTPage.tsx reads: r.form, r.period, r.due, r.status
const toClient = (f) => ({
  id: f._id,
  form: f.form,
  period: f.period,
  due: formatDate(f.dueDate),
  status: f.status,
  outputGst: f.outputGst,
  inputItc: f.inputItc,
  netPayable: f.netPayable,
});

// @desc    Get GST filing history for the logged-in user
// @route   GET /api/gst
// @access  Private
const getGSTFilings = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const filings = await GSTFiling.find({ user: userId }).sort({ dueDate: -1 });
    res.json(filings.map(toClient));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch GST filings", error: error.message });
  }
};

// @desc    File a GST return for a given form + period
// @route   POST /api/gst/file
// @access  Private
const fileGST = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { form, period } = req.body;
    if (!form || !period) {
      return res.status(400).json({ message: "form and period are required" });
    }

    let filing = await GSTFiling.findOne({ user: userId, form, period });

    if (filing) {
      filing.status = "Paid";
      filing.filedDate = new Date();
      await filing.save();
    } else {
      // Covers filing something (e.g. from the alert banner) that has no history row yet
      filing = await GSTFiling.create({
        user: userId,
        form,
        period,
        status: "Paid",
        filedDate: new Date(),
      });
    }

    await Activity.create({
      user: userId,
      icon: "✅",
      text: `Filed ${form} for ${period}`,
      color: "text-emerald-600",
    });

    res.json(toClient(filing));
  } catch (error) {
    res.status(500).json({ message: "Failed to file GST return", error: error.message });
  }
};

module.exports = { getGSTFilings, fileGST };
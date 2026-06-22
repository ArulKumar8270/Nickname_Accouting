const express  = require("express");
const cors     = require("cors");
const dotenv   = require("dotenv");
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");  
const jwt      = require("jsonwebtoken");
dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────
app.use("/api/auth",          require("./routes/authRoutes"));
app.use("/api/invoices",      require("./routes/invoiceRoutes"));
app.use("/api/users",         require("./routes/userRoutes"));
app.use("/api/user-invoices", require("./routes/userInvoiceRoutes"));
app.use("/api/expenses",      require("./routes/expenseRoutes"));
app.use("/api/settings",      require("./routes/settingsRoutes"));
app.use("/api/gst",      require("./routes/gstRoutes"));
app.use("/api/activity", require("./routes/activityRoutes"));

// ── Health Check ─────────────────────────────────────────
app.get("/", (req, res) => res.json({ message: "Accounting API running" }));

// ── Connect & Start ──────────────────────────────────────
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => { console.error(err.message); process.exit(1); });
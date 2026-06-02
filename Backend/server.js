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

// ── Models ───────────────────────────────────────────────
const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ["Admin", "User"], default: "User" },
  status:   { type: String, enum: ["Active", "Inactive"], default: "Active" },
}, { timestamps: true });

const InvoiceSchema = new mongoose.Schema({
  vendor:    { type: String, required: true },
  date:      { type: String, required: true },
  amount:    { type: Number, required: true },
  status:    { type: String, enum: ["Pending", "Paid", "Overdue"], default: "Pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const UserInvoiceSchema = new mongoose.Schema({
  customer:  { type: String, required: true },
  date:      { type: String, required: true },
  amount:    { type: Number, required: true },
  status:    { type: String, enum: ["Pending", "Paid", "Overdue", "Sent", "Draft"], default: "Pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const ExpenseSchema = new mongoose.Schema({
  category:  { type: String, required: true },
  vendor:    { type: String, required: true },
  date:      { type: String, required: true },
  amount:    { type: Number, required: true },
  status:    { type: String, enum: ["Pending", "Paid"], default: "Pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const SettingsSchema = new mongoose.Schema({
  companyName: { type: String, default: "Nexus Technologies Pvt Ltd" },
  gstin:       { type: String, default: "29AABCN1234A1Z5" },
  pan:         { type: String, default: "AABCN1234A" },
  fiscalYear:  { type: String, default: "April 1" },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const User        = mongoose.model("User",        UserSchema);
const Invoice     = mongoose.model("Invoice",     InvoiceSchema);
const UserInvoice = mongoose.model("UserInvoice", UserInvoiceSchema);
const Expense     = mongoose.model("Expense",     ExpenseSchema);
const Settings    = mongoose.model("Settings",    SettingsSchema);

// ── Helpers ──────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ── Middleware ───────────────────────────────────────────
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch {
    res.status(401).json({ message: "Token invalid" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "Admin") return res.status(403).json({ message: "Admin only" });
  next();
};

// ── Auth Routes ──────────────────────────────────────────
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
    if (user.status === "Inactive") return res.status(403).json({ message: "Account inactive" });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role: role || "User" });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Invoice Routes (Admin) ───────────────────────────────
app.get("/api/invoices",                  protect, adminOnly, async (req, res) => { res.json(await Invoice.find().sort({ createdAt: -1 })); });
app.post("/api/invoices",                 protect, adminOnly, async (req, res) => { res.status(201).json(await Invoice.create({ ...req.body, createdBy: req.user._id })); });
app.put("/api/invoices/:id",              protect, adminOnly, async (req, res) => { const d = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true }); d ? res.json(d) : res.status(404).json({ message: "Not found" }); });
app.patch("/api/invoices/:id/pay",        protect, adminOnly, async (req, res) => { const d = await Invoice.findByIdAndUpdate(req.params.id, { status: "Paid" }, { new: true }); d ? res.json(d) : res.status(404).json({ message: "Not found" }); });
app.delete("/api/invoices/:id",           protect, adminOnly, async (req, res) => { await Invoice.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); });

// ── User Routes (Admin) ──────────────────────────────────
app.get("/api/users",                     protect, adminOnly, async (req, res) => { res.json(await User.find().select("-password").sort({ createdAt: -1 })); });
app.post("/api/users",                    protect, adminOnly, async (req, res) => {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) return res.status(400).json({ message: "Email exists" });
  const hash = await bcrypt.hash(req.body.password || "pass123", 10);
  const user = await User.create({ ...req.body, password: hash });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, status: user.status });
});
app.put("/api/users/:id",                 protect, adminOnly, async (req, res) => { const d = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password"); d ? res.json(d) : res.status(404).json({ message: "Not found" }); });
app.patch("/api/users/:id/toggle-status", protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "Not found" });
  user.status = user.status === "Active" ? "Inactive" : "Active";
  await user.save();
  res.json({ _id: user._id, name: user.name, status: user.status });
});
app.delete("/api/users/:id",              protect, adminOnly, async (req, res) => { await User.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); });

// ── User Invoice Routes ──────────────────────────────────
app.get("/api/user-invoices",             protect, async (req, res) => { res.json(await UserInvoice.find({ createdBy: req.user._id }).sort({ createdAt: -1 })); });
app.post("/api/user-invoices",            protect, async (req, res) => { res.status(201).json(await UserInvoice.create({ ...req.body, createdBy: req.user._id })); });
app.put("/api/user-invoices/:id",         protect, async (req, res) => { const d = await UserInvoice.findByIdAndUpdate(req.params.id, req.body, { new: true }); d ? res.json(d) : res.status(404).json({ message: "Not found" }); });
app.patch("/api/user-invoices/:id/pay",   protect, async (req, res) => { const d = await UserInvoice.findByIdAndUpdate(req.params.id, { status: "Paid" }, { new: true }); d ? res.json(d) : res.status(404).json({ message: "Not found" }); });
app.delete("/api/user-invoices/:id",      protect, async (req, res) => { await UserInvoice.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); });

// ── Expense Routes ───────────────────────────────────────
app.get("/api/expenses",                  protect, async (req, res) => { res.json(await Expense.find({ createdBy: req.user._id }).sort({ createdAt: -1 })); });
app.post("/api/expenses",                 protect, async (req, res) => { res.status(201).json(await Expense.create({ ...req.body, createdBy: req.user._id })); });
app.put("/api/expenses/:id",              protect, async (req, res) => { const d = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true }); d ? res.json(d) : res.status(404).json({ message: "Not found" }); });
app.patch("/api/expenses/:id/pay",        protect, async (req, res) => { const d = await Expense.findByIdAndUpdate(req.params.id, { status: "Paid" }, { new: true }); d ? res.json(d) : res.status(404).json({ message: "Not found" }); });
app.delete("/api/expenses/:id",           protect, async (req, res) => { await Expense.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); });

// ── Settings Routes ──────────────────────────────────────
app.get("/api/settings",                  protect, adminOnly, async (req, res) => {
  let s = await Settings.findOne({ createdBy: req.user._id });
  if (!s) s = await Settings.create({ createdBy: req.user._id });
  res.json(s);
});
app.patch("/api/settings/:id",            protect, adminOnly, async (req, res) => {
  const s = await Settings.findByIdAndUpdate(req.params.id, req.body, { new: true });
  s ? res.json(s) : res.status(404).json({ message: "Not found" });
});

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
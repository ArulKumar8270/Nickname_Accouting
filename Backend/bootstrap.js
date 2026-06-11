const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const dotenv   = require("dotenv");

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db;

  // Clear collections
  await db.collection("users").deleteMany({});
  await db.collection("invoices").deleteMany({});
  await db.collection("expenses").deleteMany({});
  await db.collection("userinvoices").deleteMany({});

  // Hash passwords
  const adminHash  = await bcrypt.hash("admin123", 10);
  const userHash   = await bcrypt.hash("pass123",  10);
  const rifayaHash = await bcrypt.hash("12101997", 10);

  // Insert admin
  const admin = await db.collection("users").insertOne({
    name: "Admin User", email: "admin@gmail.com",
    password: adminHash, role: "Admin", status: "Active",
    createdAt: new Date(), updatedAt: new Date(),
  });

  // Insert users
  await db.collection("users").insertMany([
    { name: "Priya Sharma", email: "priya@nexus.in",          password: userHash,   role: "User", status: "Active",   createdAt: new Date(), updatedAt: new Date() },
    { name: "Arjun Kumar",  email: "arjun@nexus.in",          password: userHash,   role: "User", status: "Active",   createdAt: new Date(), updatedAt: new Date() },
    { name: "Rifaya Safi",  email: "rifayasafi97@gmail.com",  password: rifayaHash, role: "User", status: "Active",   createdAt: new Date(), updatedAt: new Date() },
    { name: "User One",     email: "user1@gmail.com",         password: userHash,   role: "User", status: "Active",   createdAt: new Date(), updatedAt: new Date() },
    { name: "User Two",     email: "user2@gmail.com",         password: userHash,   role: "User", status: "Active",   createdAt: new Date(), updatedAt: new Date() },
    { name: "User Three",   email: "user3@gmail.com",         password: userHash,   role: "User", status: "Active",   createdAt: new Date(), updatedAt: new Date() },
    { name: "User Four",    email: "user4@gmail.com",         password: userHash,   role: "User", status: "Inactive", createdAt: new Date(), updatedAt: new Date() },
  ]);

  // Insert invoices
  await db.collection("invoices").insertMany([
    { vendor: "AWS India",        date: "Mar 28", amount: 48200, status: "Pending", createdBy: admin.insertedId, createdAt: new Date(), updatedAt: new Date() },
    { vendor: "Razorpay",         date: "Mar 25", amount: 12500, status: "Paid",    createdBy: admin.insertedId, createdAt: new Date(), updatedAt: new Date() },
    { vendor: "Google Workspace", date: "Mar 20", amount: 6800,  status: "Paid",    createdBy: admin.insertedId, createdAt: new Date(), updatedAt: new Date() },
    { vendor: "Zoho Corp",        date: "Mar 15", amount: 9500,  status: "Overdue", createdBy: admin.insertedId, createdAt: new Date(), updatedAt: new Date() },
    { vendor: "Freshworks",       date: "Mar 10", amount: 15000, status: "Pending", createdBy: admin.insertedId, createdAt: new Date(), updatedAt: new Date() },
  ]);

  // Insert expenses
  await db.collection("expenses").insertMany([
    { category: "Office Rent",      vendor: "Krishna Properties", date: "Mar 1",  amount: 35000, status: "Paid",    createdBy: admin.insertedId, createdAt: new Date(), updatedAt: new Date() },
    { category: "Internet & Phone", vendor: "BSNL / Airtel",      date: "Mar 5",  amount: 4500,  status: "Paid",    createdBy: admin.insertedId, createdAt: new Date(), updatedAt: new Date() },
    { category: "Software License", vendor: "Zoho Corporation",   date: "Mar 8",  amount: 12000, status: "Paid",    createdBy: admin.insertedId, createdAt: new Date(), updatedAt: new Date() },
    { category: "Travel",           vendor: "Self",               date: "Mar 12", amount: 8200,  status: "Pending", createdBy: admin.insertedId, createdAt: new Date(), updatedAt: new Date() },
    { category: "Staff Salary",     vendor: "Payroll",            date: "Mar 31", amount: 85000, status: "Pending", createdBy: admin.insertedId, createdAt: new Date(), updatedAt: new Date() },
  ]);

  // Insert user invoices
  await db.collection("userinvoices").insertMany([
    { customer: "Rajesh Traders",    date: "Mar 28", amount: 45000,  status: "Paid",    createdBy: admin.insertedId, createdAt: new Date(), updatedAt: new Date() },
    { customer: "Meena Enterprises", date: "Mar 26", amount: 120000, status: "Sent",    createdBy: admin.insertedId, createdAt: new Date(), updatedAt: new Date() },
    { customer: "Karthik & Co",      date: "Mar 24", amount: 78500,  status: "Overdue", createdBy: admin.insertedId, createdAt: new Date(), updatedAt: new Date() },
    { customer: "Sri Murugan Stores",date: "Mar 22", amount: 234000, status: "Pending", createdBy: admin.insertedId, createdAt: new Date(), updatedAt: new Date() },
    { customer: "Anbu Industries",   date: "Mar 20", amount: 56750,  status: "Paid",    createdBy: admin.insertedId, createdAt: new Date(), updatedAt: new Date() },
  ]);

  console.log("Bootstrap completed successfully!");
  console.log("Admin → admin@gmail.com      / admin123");
  console.log("User  → rifayasafi97@gmail.com / 12101997");
  console.log("User  → user1@gmail.com       / pass123");
  process.exit();
};

run().catch((err) => { console.error(err.message); process.exit(1); });
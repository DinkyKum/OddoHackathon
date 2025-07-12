const express = require("express");
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Admin Signup
adminRouter.post("/signup", async (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).json({ message: "ID and password are required" });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET not set in environment" });
  }

  try {
    const existingAdmin = await Admin.findOne({ id });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const newAdmin = new Admin({ id, password }); // password will be hashed in schema
    await newAdmin.save();

    const token = jwt.sign({ adminId: newAdmin._id }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(201).json({ message: "Signup successful", token });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin Login
adminRouter.post("/login", async (req, res) => {
  const { id, password } = req.body;

  console.log("Login attempt:", id, password); // ✅ Log 1

  if (!JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET is not set" });
  }

  try {
    const admin = await Admin.findOne({ id });
    if (!admin) {
      console.log("Admin not found for id:", id); // ✅ Log 2
      return res.status(401).json({ message: "Invalid ID or password" });
    }

    console.log("Admin found:", admin); // ✅ Log 3

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("Password matched?", isMatch); // ✅ Log 4

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid ID or password" });
    }

    const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error); // ✅ Log 5
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = adminRouter;

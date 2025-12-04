import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/User.js";
import secretoryModel from "../models/Secretory.js"; // 👈 import secretory model
import { sendMail } from "../services/mailService.js"; // (Optional) mailer utility 

import dotenv from "dotenv";
dotenv.config();


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// 🔹 Admin registration (one-time)
router.post("/register-admin", async (req, res) => {
  try {
    const { UserName, UserGender, UserCNo, UserEmailID, Password } = req.body;

    const adminExists = await userModel.findOne({ Role: "Admin" });
    if (adminExists)
      return res.status(400).json({ message: "Admin already exists!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    const adminUser = new userModel({
      UserName,
      UserGender,
      UserCNo,
      Role: "Admin",
      Password: hashedPassword,
      UserEmailID,
      Status: "Active"
    });

    await adminUser.save();
    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Login for any user (Admin / Owner / Tenant / Secretory)
router.post("/login", async (req, res) => {
  try {
    const { UserEmailID, Password } = req.body;

    if (!UserEmailID || !Password) {
      return res.status(400).json({ message: "Please enter email and password" });
    }

    const user = await userModel.findOne({
      UserEmailID: { $regex: `^${UserEmailID}$` }
    });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Generate token
    const token = jwt.sign(
      { id: user._id, role: user.Role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    
    // ✅ Check if user is also Secretory
    const isSecretory = await secretoryModel.findOne({ UserID: user._id });

    // ✅ Build roles array
    const roles = [user.Role];
    if (isSecretory && !roles.includes("Secretory")) {
      roles.push("Secretory");
    }

    res.status(200).json({
      message: `Welcome ${user.UserName}`,
      token,
      email: user.UserEmailID,
      roles // 👈 return array instead of single role
    });

  } catch (err) {
    console.error("Login route error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// 🔹 Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await userModel.findOne({
      UserEmailID: { $regex: `^${email}$`, $options: "i" },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = Date.now() + 5 * 60 * 1000; // 5 min expiry

    global.otpStore = global.otpStore || {};
    global.otpStore[email] = { otp, expiry };

    const subject = "Your OTP Code - Society Management System";
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 10px;">
        <h2>🔐 OTP Verification</h2>
        <p>Hello <b>${user.UserName}</b>,</p>
        <p>Your OTP for password reset is:</p>
        <h1 style="color:#4CAF50;">${otp}</h1>
        <p>This OTP will expire in <b>5 minutes</b>.</p>
        <br/>
        <p>Regards,<br/>${process.env.FROM_NAME}</p>
      </div>
    `;

    // Send email
    const mailSent = await sendMail(email, subject, html, `Your OTP is ${otp}`);

    if (!mailSent) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    console.log(`📩 OTP sent to ${email}: ${otp}`);

    // Return success (don’t include OTP for security)
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// 🔹 Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP required" });

    const record = global.otpStore?.[email];
    if (!record) return res.status(400).json({ message: "No OTP found" });
    if (record.expiry < Date.now())
      return res.status(400).json({ message: "OTP expired" });
    if (record.otp != otp)
      return res.status(400).json({ message: "Invalid OTP" });

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword)
      return res.status(400).json({ message: "Email and new password required" });

    const user = await userModel.findOne({
      UserEmailID: { $regex: `^${email}$`, $options: "i" },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.Password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Cleanup OTP
    if (global.otpStore) delete global.otpStore[email];

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;

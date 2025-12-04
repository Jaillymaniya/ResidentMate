// routes/changePassword.js (or inside profileRoutes.js)
import express from "express";
import bcrypt from "bcryptjs";
import userModel from "../models/User.js";

const router = express.Router();

// 🔹 Change password (for Admin, Owner, Tenant)
router.put("/change-password/:email", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { email } = req.params;

    const user = await userModel.findOne({ UserEmailID: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔸 Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // 🔸 Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.Password = hashed;
    user.DateUpdated = new Date();

    await user.save();

    res.json({ message: "Password updated successfully ✅" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;

import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";  // your Mongoose model file
import AssignHome from "../models/AssignHome.js";
// import sendMail from "../utils/sendMail.js"; // utility to send emails
import { sendMail } from "../services/mailService.js";


const router = express.Router();

// Register Owner (without controller folder)
// router.post("/register-owner", async (req, res) => {
//   try {
//     const { UserName, UserGender, UserCNo, UserEmailID, Password } = req.body;

//     const existingUser = await User.findOne({ UserEmailID });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(Password, 10);

//     const newOwner = new User({
//       UserName,
//       UserGender,
//       UserCNo,
//       UserEmailID,
//       Password: hashedPassword,
//       Role: "Owner",
//     });

//     await newOwner.save();
//     res.status(201).json({ message: "Owner registered successfully", owner: newOwner });
//   } catch (error) {
//     res.status(500).json({ message: "Error registering owner", error });
//   }
// });


// ✅ Register Owner + Send Email
router.post("/register-owner", async (req, res) => {
  try {
    const { UserName, UserGender, UserCNo, UserEmailID, Password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ UserEmailID });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Save owner
    const newOwner = new User({
      UserName,
      UserGender,
      UserCNo,
      UserEmailID,
      Password: hashedPassword,
      Role: "Owner",
      Status: "Active",
    });

    await newOwner.save();

    // ✅ Send welcome email
    const emailHtml = `
      <h3>Welcome to Society Management System</h3>
      <p>Dear ${UserName},</p>
      <p>Your owner account has been successfully created.</p>
      <p><b>Email:</b> ${UserEmailID}<br/><b>Password:</b> ${Password}</p>
      <p>Regards,<br/>Society Management System</p>
    `;

    await sendMail(UserEmailID, "Owner Account Created", emailHtml);

    res.status(201).json({
      message: "Owner registered and email sent successfully",
      owner: newOwner,
    });
  } catch (error) {
    console.error("❌ Error in register-owner:", error);
    res.status(500).json({ message: "Error registering owner", error });
  }
});



// Update Owner details
router.put("/owners/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { UserName, UserGender, UserCNo, UserEmailID, Password } = req.body;

    const updateData = { UserName, UserGender, UserCNo, UserEmailID };

    if (Password && Password.trim() !== "") {
      const bcrypt = await import("bcryptjs");
      const hashedPassword = await bcrypt.hash(Password, 10);
      updateData.Password = hashedPassword;
    }

    const updatedOwner = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedOwner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    res.status(200).json({ message: "Owner updated successfully", owner: updatedOwner });
  } catch (error) {
    res.status(500).json({ message: "Error updating owner", error });
  }
}); 




// Soft delete user + remove assignment
router.delete("/owners/:id", async (req, res) => {
  try {
    const ownerId = req.params.id;

    // 1️⃣ Soft delete user
    await User.findByIdAndUpdate(ownerId, { Status: "Inactive" });

    // 2️⃣ Permanently remove home assignment
    await AssignHome.deleteOne({ UserID: ownerId });

    res.json({ message: "Owner deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});


// router.post("/register-owner", async (req, res) => {
//   const { UserName, UserEmailID, Password } = req.body;
//   // save owner as before ...

//   // send mail
//   const emailHtml = `
//     <h3>Welcome to Society Management System</h3>
//     <p>Dear ${UserName},</p>
//     <p>Your account has been successfully registered.</p>
//     <p><b>Email:</b> ${UserEmailID}<br/><b>Password:</b> ${Password}</p>
//     <p>Login here: <a href="${process.env.FRONTEND_URL}/login">${process.env.FRONTEND_URL}/login</a></p>
//   `;

//   await sendMail(UserEmailID, "Your Owner Account Created", emailHtml);
//   res.status(200).json({ message: "Owner registered & email sent successfully" });
// });



export default router;

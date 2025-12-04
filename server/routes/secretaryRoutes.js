// server/routes/secretaryRoutes.js
import express from "express";
import userModel from "../models/User.js";
import Secretory from "../models/Secretory.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Nodemailer transporter configuration (Gmail example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,        // .env me set karein
    pass: process.env.GMAIL_APP_PASSWORD  // .env me set karein
  }
});

/**
 * GET /api/secretory/owners
 * Return all users that are Owners (for listing in frontend)
 */
// router.get("/secretory/owners", async (req, res) => {
//   try {
//     const owners = await userModel.find({ Role: "Owner" }).select("_id UserName UserEmailID UserCNo Role");
//     return res.json({ success: true, owners });
//   } catch (err) {
//     console.error("GET /secretory/owners error:", err);
//     return res.status(500).json({ success: false, message: "Error fetching owners" });
//   }
// });
router.get("/secretory/owners", async (req, res) => {
  try {
    const owners = await userModel
      .find({ Role: "Owner", Status: "Active" }) // ✅ only active owners
      .select("_id UserName UserEmailID UserCNo Role Status");

    return res.json({ success: true, owners });
  } catch (err) {
    console.error("GET /secretory/owners error:", err);
    return res.status(500).json({ success: false, message: "Error fetching owners" });
  }
});


/**
 * GET /api/secretory/list
 * Returns list of secretaries with populated user info
 */
router.get("/secretory/list", async (req, res) => {
  try {
    const list = await Secretory.find()
      .populate({ path: "UserID", select: "UserName UserEmailID UserCNo Role" })
      .sort({ DateCreated: -1 });
    return res.json({ success: true, secretaries: list });
  } catch (err) {
    console.error("GET /secretory/list error:", err);
    return res.status(500).json({ success: false, message: "Error fetching secretaries" });
  }
});

/**
 * POST /api/secretory/assign/:userId
 * Assign given user as secretary (adds entry in Tbl_Secretory)
 * Also sends professional congratulation email to assigned user
//  */
// router.post("/secretory/assign/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const user = await userModel.findById(userId).select("_id UserName UserEmailID UserCNo Role");
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     // Only Owner allowed
//     if (user.Role !== "Owner" && !user.Role.includes("Owner")) {
//       return res.status(400).json({ success: false, message: "Only Owner can be assigned as Secretary" });
//     }

//     // Prevent duplicate record
//     const exist = await Secretory.findOne({ UserID: userId });
//     if (exist) return res.status(400).json({ success: false, message: "User already a Secretary" });

//     const newSec = await Secretory.create({ UserID: userId });

//     // Populate before returning
//     const populated = await newSec.populate({ path: "UserID", select: "UserName UserEmailID UserCNo Role" });

//     // Professional congratulation email
//     const mailOptions = {
//       from: `"${process.env.FROM_NAME || "Society Management"}" <${process.env.GMAIL_USER}>`,
//       to: user.UserEmailID,
//       subject: "Welcome! You Are Now Society Secretary 🎉",
//       text: `
// Hi ${user.UserName},

// We are thrilled to announce that you have officially been appointed as the Secretary of our society!

// ----------------------------

// Role: Secretary
// Date: ${new Date().toLocaleDateString()}

// ----------------------------

// Your leadership and dedication have always inspired us, and we are excited to have you take on this important responsibility.

// Feel free to reach out if you have any questions, or need any support. The managing committee is here to assist you at every step.

// Once again, congratulations on your new role!

// Best regards,
// Society Management Team
//       `.replace(/^ +/gm, '')
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error("Error sending email:", error);
//       } else {
//         console.log("Email sent: " + info.response);
//       }
//     });

//     return res.json({ success: true, message: "Secretary Assigned Successfully", secretary: populated });
//   } catch (err) {
//     console.error("POST /secretory/assign error:", err);
//     return res.status(500).json({ success: false, message: "Server Error" });
//   }
// });


router.post("/secretory/assign/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId).select("_id UserName UserEmailID UserCNo Role");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // ✅ Check if there is already an active secretary
    const existingSecretary = await Secretory.findOne();
    if (existingSecretary) {
      return res.status(400).json({
        success: false,
        message: "A Secretary is already assigned. Please remove the current Secretary before assigning a new one.",
      });
    }

    // Only Owner allowed
    if (user.Role !== "Owner" && !user.Role.includes("Owner")) {
      return res.status(400).json({ success: false, message: "Only Owner can be assigned as Secretary" });
    }

    // Prevent duplicate record (if same user already assigned)
    const exist = await Secretory.findOne({ UserID: userId });
    if (exist) return res.status(400).json({ success: false, message: "User already a Secretary" });

    // ✅ Create new Secretary
    const newSec = await Secretory.create({ UserID: userId });
    const populated = await newSec.populate({ path: "UserID", select: "UserName UserEmailID UserCNo Role" });

    // ✅ Send congratulation email
    const mailOptions = {
      from: `"${process.env.FROM_NAME || "Society Management"}" <${process.env.GMAIL_USER}>`,
      to: user.UserEmailID,
      subject: "Welcome! You Are Now Society Secretary 🎉",
      text: `
Hi ${user.UserName},

We are thrilled to announce that you have officially been appointed as the Secretary of our society!

----------------------------
Role: Secretary
Date: ${new Date().toLocaleDateString()}
----------------------------

Your leadership and dedication have always inspired us, and we are excited to have you take on this important responsibility.

Once again, congratulations on your new role!

Best regards,
Society Management Team
      `.replace(/^ +/gm, "")
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return res.json({ success: true, message: "Secretary Assigned Successfully", secretary: populated });
  } catch (err) {
    console.error("POST /secretory/assign error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});


// // GET /api/secretory/:email
// router.get("/secretory/:email", async (req, res) => {
//   try {
//     const { email } = req.params;

//     const secretary = await Secretory.findOne()
//       .populate({
//         path: "UserID",
//         select: "UserName UserEmailID UserCNo Role"
//       });

//     if (!secretary) {
//       return res.status(404).json({ success: false, message: "No secretary assigned" });
//     }

//     if (secretary.UserID.UserEmailID !== email) {
//       return res.status(404).json({ success: false, message: "Secretary not found for this email" });
//     }

//     return res.json({ success: true, secretary });
//   } catch (err) {
//     console.error("GET /secretory/:email error:", err);
//     return res.status(500).json({ success: false, message: "Server Error" });
//   }
// });




/**
 * DELETE /api/secretory/remove/:id
 */
router.delete("/secretory/remove/:id", async (req, res) => {
  try {
    const removed = await Secretory.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ success: false, message: "Secretary record not found" });
    return res.json({ success: true, message: "Secretary removed" });
  } catch (err) {
    console.error("DELETE /secretory/remove error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;

// secretaryRoutes.jsx
import express from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import userModel from "../models/User.js";
import secretoryModel from "../models/Secretory.js"; // correct model for secretary

const router = express.Router();

// --- MULTER SETUP ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/**
 * ===========================
 *        SECRETARY ROUTES
 * ===========================
 */
router.get("/secretary/:email", async (req, res) => {
  try {
    const user = await userModel.findOne({ UserEmailID: req.params.email }).select("-Password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const sec = await secretoryModel.findOne({ UserID: user._id });
    if (!sec) return res.status(404).json({ message: "Secretary role not assigned" });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/secretary/update/:email", upload.single("Photo"), async (req, res) => {
  try {
    const { UserName, UserCNo, UserGender, Password } = req.body;
    const user = await userModel.findOne({ UserEmailID: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const sec = await secretoryModel.findOne({ UserID: user._id });
    if (!sec) return res.status(404).json({ message: "Secretary role not assigned" });

    user.UserName = UserName || user.UserName;
    user.UserCNo = UserCNo || user.UserCNo;
    user.UserGender = UserGender || user.UserGender;
    if (req.file) user.Photo = req.file.filename;
    if (Password && Password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.Password = await bcrypt.hash(Password, salt);
    }
    await user.save();
    res.status(200).json({ message: "Secretary profile updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ===========================
 *         ADMIN ROUTES
 * ===========================
 */
router.get("/admin/:email", async (req, res) => {
  try {
    const admin = await userModel
      .findOne({ UserEmailID: req.params.email, Role: "Admin" })
      .select("-Password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/admin/update/:email", upload.single("Photo"), async (req, res) => {
  try {
    const { UserName, UserCNo, UserGender, Password } = req.body;
    const admin = await userModel.findOne({
      UserEmailID: req.params.email,
      Role: "Admin",
    });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.UserName = UserName || admin.UserName;
    admin.UserCNo = UserCNo || admin.UserCNo;
    admin.UserGender = UserGender || admin.UserGender;
    if (req.file) admin.Photo = req.file.filename;
    if (Password && Password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      admin.Password = await bcrypt.hash(Password, salt);
    }
    await admin.save();
    res.status(200).json({ message: "Admin profile updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ===========================
 *         OWNER ROUTES
 * ===========================
 */
router.get("/owner/:email", async (req, res) => {
  try {
    const owner = await userModel
      .findOne({ UserEmailID: req.params.email, Role: "Owner" })
      .select("-Password");
    if (!owner) return res.status(404).json({ message: "Owner not found" });
    res.status(200).json(owner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/owner/update/:email", upload.single("Photo"), async (req, res) => {
  try {
    const { UserName, UserCNo, UserGender, Password } = req.body;
    const owner = await userModel.findOne({
      UserEmailID: req.params.email,
      Role: "Owner",
    });
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    owner.UserName = UserName || owner.UserName;
    owner.UserCNo = UserCNo || owner.UserCNo;
    owner.UserGender = UserGender || owner.UserGender;
    if (req.file) owner.Photo = req.file.filename;
    if (Password && Password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      owner.Password = await bcrypt.hash(Password, salt);
    }
    await owner.save();
    res.status(200).json({ message: "Owner profile updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ===========================
 *         TENANT ROUTES
 * ===========================
 */
router.get("/tenant/:email", async (req, res) => {
  try {
    const tenant = await userModel
      .findOne({ UserEmailID: req.params.email, Role: "Tenant" })
      .select("-Password");
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });
    res.status(200).json(tenant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/tenant/update/:email", upload.single("Photo"), async (req, res) => {
  try {
    const { UserName, UserCNo, UserGender, Password } = req.body;
    const tenant = await userModel.findOne({
      UserEmailID: req.params.email,
      Role: "Tenant",
    });
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    tenant.UserName = UserName || tenant.UserName;
    tenant.UserCNo = UserCNo || tenant.UserCNo;
    tenant.UserGender = UserGender || tenant.UserGender;
    if (req.file) tenant.Photo = req.file.filename;
    if (Password && Password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      tenant.Password = await bcrypt.hash(Password, salt);
    }
    await tenant.save();
    res.status(200).json({ message: "Tenant profile updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
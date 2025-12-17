import express from "express";
import multer from "multer";
import Home from "../models/Home.js";
import AssignHome from "../models/AssignHome.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure 'uploads' folder exists
const uploadDir = path.join("./uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// --- CREATE Home with image upload ---
router.post("/", upload.single("HomePhoto"), async (req, res) => {
  try {
    const homeData = { ...req.body };
    if (req.file) {
      homeData.HomePhoto = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }
    const home = new Home(homeData);
    await home.save();
    res.status(201).json(home);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- GET all Homes ---
router.get("/", async (req, res) => {
  try {
    const homes = await Home.find();
    res.json(homes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // --- GET *available rental* homes for guest/tenant ---
// router.get("/rental", async (req, res) => {
//   try {
//     const homes = await Home.find({
//       IsRental: true,
//       Status: "Available"
//     }).populate("SocietyID");
//     res.status(200).json(homes);
//   } catch (err) {
//     console.error("Error fetching rental homes:", err);
//     res.status(500).json({ error: err.message });
//   }
// });


// // Get ALL rental homes (regardless of Status)
// router.get("/rental", async (req, res) => {
//   try {
//     // Step 1: find all rental homes assigned to tenants
//     const tenantAssigned = await AssignHome.find({
//       RelationType: "Tenant"
//     }).distinct("HomeID");

//     // Step 2: fetch rental homes that are NOT assigned to tenants
//     const homes = await Home.find({
//       IsRental: true,
//       _id: { $nin: tenantAssigned }
//     }).populate("SocietyID");

//     res.status(200).json(homes);
//   } catch (err) {
//     console.error("Error fetching rental homes:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

router.get("/rental", async (req, res) => {
  try {
    // 1️⃣ Get all homes assigned to tenants
    const tenantAssigned = await AssignHome.find({
      RelationType: "Tenant"
    }).distinct("HomeID");

    // 2️⃣ Get all homes assigned to owners
    const ownerAssigned = await AssignHome.find({
      RelationType: "Owner"
    }).distinct("HomeID");

    // 3️⃣ Fetch rental homes that:
    //    - Are rental (IsRental = true)
    //    - Are NOT assigned to tenants
    //    - DO have an owner (exist in ownerAssigned array)
    const homes = await Home.find({
      IsRental: true,
      _id: { $nin: tenantAssigned, $in: ownerAssigned }
    }).populate("StreetID");

    res.status(200).json(homes);
  } catch (err) {
    console.error("Error fetching rental homes:", err);
    res.status(500).json({ error: err.message });
  }
});



// --- GET available homes ---
router.get("/available", async (req, res) => {
  try {
    const homes = await Home.find({ Status: "Available" }); // or your availability logic
    res.status(200).json(homes);
  } catch (err) {
    console.error("Error fetching available homes:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- GET single Home by _id ---
router.get("/:id", async (req, res) => {
  try {
    const home = await Home.findById(req.params.id);
    if (!home) return res.status(404).json({ error: "Home not found" });
    res.json(home);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- UPDATE Home with optional new image ---
router.put("/:id", upload.single("HomePhoto"), async (req, res) => {
  try {
    const homeData = { ...req.body, DateUpdated: Date.now() };
    if (req.file) {
      homeData.HomePhoto = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }
    const home = await Home.findByIdAndUpdate(req.params.id, homeData, { new: true });
    if (!home) return res.status(404).json({ error: "Home not found" });
    res.json(home);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- DELETE Home ---
router.delete("/:id", async (req, res) => {
  try {
    const home = await Home.findByIdAndDelete(req.params.id);
    if (!home) return res.status(404).json({ error: "Home not found" });
    res.json({ message: "Home deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Serve uploaded images
router.use("/uploads", express.static("uploads"));

export default router;

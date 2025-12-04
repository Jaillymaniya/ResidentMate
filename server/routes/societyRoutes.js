import express from "express";
import Society from "../models/Society.js";

const router = express.Router();

// GET all societies
router.get("/", async (req, res) => {
  try {
    const societies = await Society.find();
    res.json(societies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new society
// router.post("/", async (req, res) => {
//   try {
//     const society = new Society(req.body);
//     const saved = await society.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// POST create new society
router.post("/", async (req, res) => {
  try {
    // Check if one society already exists
    const count = await Society.countDocuments();
    if (count > 0) {
      return res.status(400).json({
        message: "Only one society can be created. Please edit the existing society."
      });
    }

    const society = new Society(req.body);
    const saved = await society.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// PUT update society
router.put("/:id", async (req, res) => {
  try {
    const updated = await Society.findByIdAndUpdate(
      req.params.id,
      { ...req.body, DateUpdated: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE society
router.delete("/:id", async (req, res) => {
  try {
    await Society.findByIdAndDelete(req.params.id);
    res.json({ message: "Society deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

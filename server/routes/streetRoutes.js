import express from "express";
import Street from "../models/Street.js";

const router = express.Router();

// GET all streets
router.get("/", async (req, res) => {
  try {
    const streets = await Street.find();
    res.json({ success: true, data: streets });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});



export default router;

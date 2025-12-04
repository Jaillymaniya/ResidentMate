// import express from "express";
// import Tbl_Complaint from "../models/Tbl_Complaint.js";
// import User from "../models/User.js";

// const router = express.Router();


// // POST → Add complaint
// router.post("/complaints/add", async (req, res) => {
//   try {
//     const { ComplaintDescription, UserID } = req.body;

//     if (!ComplaintDescription || !UserID) {
//       return res.status(400).json({ error: "All fields required" });
//     }

//     const newComplaint = new Tbl_Complaint({
//       ComplaintDescription,
//       UserID,
//     });

//     await newComplaint.save();

//     res.status(200).json({ message: "Complaint submitted successfully" });
//   } catch (err) {
//     console.error("Error adding complaint:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // GET → List complaints for Owner

// // 1️⃣ GET → Get OwnerId by Email
// router.get("/complaints/getOwnerByEmail", async (req, res) => {
//   try {
//     const email = req.query.email;

//     const owner = await User.findOne({ UserEmailID: email });

//     if (!owner) {
//       return res.status(404).json({ error: "Owner not found" });
//     }

//     res.json({ ownerId: owner._id });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET → List complaints for Owner

// // GET → List complaints for Owner by ownerId
// router.get("/complaints/owner", async (req, res) => {
//   try {
//     const ownerId = req.query.ownerId; // ownerId comes from frontend

//     if (!ownerId) {
//       return res.status(400).json({ error: "ownerId required" });
//     }

//     const complaints = await Tbl_Complaint.find({
//       UserID: ownerId
//     }).sort({ DateCreated: -1 });

//     res.json(complaints); // return only complaints array

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });



// // GET → All complaints for Secretary
// router.get("/complaints", async (req, res) => {
//   try {
//     const complaints = await Tbl_Complaint.find().populate("UserID");
//     res.json(complaints);
//   } catch (err) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // PUT → Update status by Secretary
// router.put("/complaints/status/:id", async (req, res) => {
//   try {
//     const { Status } = req.body;

//     const updated = await Tbl_Complaint.findByIdAndUpdate(
//       req.params.id,
//       { Status, DateUpdated: Date.now() },
//       { new: true }
//     );

//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// // ⭐ PUT → EDIT Complaint (User can update their complaint)
// router.put("/complaints/edit/:id", async (req, res) => {
//   try {
//     const { ComplaintDescription } = req.body;

//     const updated = await Tbl_Complaint.findByIdAndUpdate(
//       req.params.id,
//       { ComplaintDescription, DateUpdated: Date.now() },
//       { new: true }
//     );

//     res.json({ message: "Complaint updated successfully", updated });
//   } catch (err) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // ⭐ DELETE → Delete Complaint
// router.delete("/complaints/delete/:id", async (req, res) => {
//   try {
//     await Tbl_Complaint.findByIdAndDelete(req.params.id);
//     res.json({ message: "Complaint deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// export default router;























// import express from "express";
// import Tbl_Complaint from "../models/Tbl_Complaint.js";
// import User from "../models/User.js";
// import Tbl_Feedback from "../models/Tbl_Feedback.js";

// const router = express.Router();

// /* -------------------- ADD COMPLAINT -------------------- */
// router.post("/complaints/add", async (req, res) => {
//   try {
//     const { ComplaintDescription, UserID } = req.body;

//     if (!ComplaintDescription || !UserID) {
//       return res.status(400).json({ error: "All fields required" });
//     }

//     const newComplaint = new Tbl_Complaint({
//       ComplaintDescription,
//       UserID,
//     });

//     await newComplaint.save();

//     res.status(200).json({ message: "Complaint submitted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// /* -------------------- GET OWNER ID BY EMAIL -------------------- */
// router.get("/complaints/getOwnerByEmail", async (req, res) => {
//   try {
//     const email = req.query.email;
//     const owner = await User.findOne({ UserEmailID: email });

//     if (!owner) return res.status(404).json({ error: "Owner not found" });

//     res.json({ ownerId: owner._id });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// /* -------------------- GET COMPLAINTS OF OWNER -------------------- */
// router.get("/complaints/owner", async (req, res) => {
//   try {
//     const ownerId = req.query.ownerId;

//     const complaints = await Tbl_Complaint.find({ UserID: ownerId })
//       .sort({ DateCreated: -1 })
//       .lean();

//     // ⭐ Add feedback inside complaint
//     for (let c of complaints) {
//       const feedback = await Tbl_Feedback.findOne({ ComplaintID: c._id }).lean();
//       c.Feedback = feedback || null;
//     }

//     res.json(complaints);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// /* -------------------- GET ALL COMPLAINTS (SECRETARY) -------------------- */
// router.get("/complaints", async (req, res) => {
//   try {
//     const complaints = await Tbl_Complaint.find().populate("UserID").lean();

//     for (let c of complaints) {
//       const feedback = await Tbl_Feedback.findOne({ ComplaintID: c._id }).lean();
//       c.Feedback = feedback || null;
//     }

//     res.json(complaints);
//   } catch (err) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// /* -------------------- UPDATE STATUS -------------------- */
// router.put("/complaints/status/:id", async (req, res) => {
//   try {
//     const updated = await Tbl_Complaint.findByIdAndUpdate(
//       req.params.id,
//       { Status: req.body.Status, DateUpdated: Date.now() },
//       { new: true }
//     );

//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// /* -------------------- EDIT COMPLAINT -------------------- */
// router.put("/complaints/edit/:id", async (req, res) => {
//   try {
//     const updated = await Tbl_Complaint.findByIdAndUpdate(
//       req.params.id,
//       { ComplaintDescription: req.body.ComplaintDescription, DateUpdated: Date.now() },
//       { new: true }
//     );

//     res.json({ message: "Complaint updated successfully", updated });
//   } catch (err) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// /* -------------------- ADD FEEDBACK (ONLY 1 TIME) -------------------- */
// router.post("/feedback/add", async (req, res) => {
//   try {
//     const { UserID, ComplaintID, Rating, Comments } = req.body;

//     // Check already submitted
//     const exists = await Tbl_Feedback.findOne({ ComplaintID });
//     if (exists) {
//       return res.status(400).json({ error: "Feedback already submitted" });
//     }

//     const newFeedback = new Tbl_Feedback({
//       UserID,
//       ComplaintID,
//       Rating,
//       Comments,
//     });

//     await newFeedback.save();

//     res.json({ message: "Feedback submitted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// /* -------------------- DELETE COMPLAINT -------------------- */
// router.delete("/complaints/delete/:id", async (req, res) => {
//   try {
//     // Also delete related feedback
//     await Tbl_Feedback.deleteOne({ ComplaintID: req.params.id });

//     await Tbl_Complaint.findByIdAndDelete(req.params.id);

//     res.json({ message: "Complaint deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// export default router;






























































import express from "express";
import Tbl_Complaint from "../models/Tbl_Complaint.js";
import User from "../models/User.js";
import Tbl_Feedback from "../models/Tbl_Feedback.js";

const router = express.Router();

/* -------------------- ADD COMPLAINT -------------------- */
router.post("/complaints/add", async (req, res) => {
  try {
    const { ComplaintDescription, UserID } = req.body;

    if (!ComplaintDescription || !UserID) {
      return res.status(400).json({ error: "All fields required" });
    }

    const newComplaint = new Tbl_Complaint({
      ComplaintDescription,
      UserID,
    });

    await newComplaint.save();

    res.status(200).json({ message: "Complaint submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------- GET OWNER ID BY EMAIL -------------------- */
router.get("/complaints/getOwnerByEmail", async (req, res) => {
  try {
    const email = req.query.email;
    const owner = await User.findOne({ UserEmailID: email });

    if (!owner) return res.status(404).json({ error: "Owner not found" });

    res.json({ ownerId: owner._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------------------- GET COMPLAINTS OF OWNER -------------------- */
router.get("/complaints/owner", async (req, res) => {
  try {
    const ownerId = req.query.ownerId;

    const complaints = await Tbl_Complaint.find({ UserID: ownerId })
      .sort({ DateCreated: -1 })
      .lean();

    for (let c of complaints) {
      const feedback = await Tbl_Feedback.findOne({ ComplaintID: c._id }).lean();
      c.Feedback = feedback || null;
    }

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------------------- GET ALL COMPLAINTS (SECRETARY) -------------------- */
router.get("/complaints", async (req, res) => {
  try {
    const complaints = await Tbl_Complaint.find().populate("UserID").lean();

    for (let c of complaints) {
      const feedback = await Tbl_Feedback.findOne({ ComplaintID: c._id }).lean();
      c.Feedback = feedback || null;
    }

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------- UPDATE STATUS -------------------- */
router.put("/complaints/status/:id", async (req, res) => {
  try {
    let status = req.body.Status;

    // ⭐ Auto-convert Solved → Resolved
    if (status === "Solved") status = "Resolved";

    const updated = await Tbl_Complaint.findByIdAndUpdate(
      req.params.id,
      { Status: status, DateUpdated: Date.now() },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------- EDIT COMPLAINT -------------------- */
router.put("/complaints/edit/:id", async (req, res) => {
  try {
    const updated = await Tbl_Complaint.findByIdAndUpdate(
      req.params.id,
      { ComplaintDescription: req.body.ComplaintDescription, DateUpdated: Date.now() },
      { new: true }
    );

    res.json({ message: "Complaint updated successfully", updated });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------- ADD FEEDBACK (ONLY 1 TIME) -------------------- */
router.post("/feedback/add", async (req, res) => {
  try {
    const { UserID, ComplaintID, Rating, Comments } = req.body;

    const exists = await Tbl_Feedback.findOne({ ComplaintID });
    if (exists) {
      return res.status(400).json({ error: "Feedback already submitted" });
    }

    const newFeedback = new Tbl_Feedback({
      UserID,
      ComplaintID,
      Rating,
      Comments,
    });

    await newFeedback.save();

    res.json({ message: "Feedback submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------- DELETE COMPLAINT -------------------- */
router.delete("/complaints/delete/:id", async (req, res) => {
  try {
    await Tbl_Feedback.deleteOne({ ComplaintID: req.params.id });
    await Tbl_Complaint.findByIdAndDelete(req.params.id);

    res.json({ message: "Complaint deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

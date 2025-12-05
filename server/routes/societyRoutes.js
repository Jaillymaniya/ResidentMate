// import express from "express";
// import Society from "../models/Society.js";

// const router = express.Router();

// // GET all societies
// router.get("/", async (req, res) => {
//   try {
//     const societies = await Society.find();
//     res.json(societies);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // POST create new society
// // router.post("/", async (req, res) => {
// //   try {
// //     const society = new Society(req.body);
// //     const saved = await society.save();
// //     res.status(201).json(saved);
// //   } catch (err) {
// //     res.status(400).json({ message: err.message });
// //   }
// // });

// // POST create new society
// router.post("/", async (req, res) => {
//   try {
//     // Check if one society already exists
//     const count = await Society.countDocuments();
//     if (count > 0) {
//       return res.status(400).json({
//         message: "Only one society can be created. Please edit the existing society."
//       });
//     }

//     const society = new Society(req.body);
//     const saved = await society.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });


// // PUT update society
// router.put("/:id", async (req, res) => {
//   try {
//     const updated = await Society.findByIdAndUpdate(
//       req.params.id,
//       { ...req.body, DateUpdated: new Date() },
//       { new: true }
//     );
//     res.json(updated);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // DELETE society
// router.delete("/:id", async (req, res) => {
//   try {
//     await Society.findByIdAndDelete(req.params.id);
//     res.json({ message: "Society deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;



import express from "express";
import Society from "../models/Society.js";
import Street from "../models/Street.js";

const router = express.Router();

// GET all societies + their streets
router.get("/", async (req, res) => {
  try {
    const societies = await Society.find();

    const result = await Promise.all(
      societies.map(async (soc) => {
        const streets = await Street.find({ societyId: soc._id });
        return {
          ...soc.toObject(),
          streets, // attach streets array
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single society + its streets (for edit)
router.get("/:id", async (req, res) => {
  try {
    const societyId = req.params.id;

    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: "Society not found" });
    }

    const streets = await Street.find({ societyId });

    res.json({ society, streets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new society + streets  (ONLY ONE society allowed)
router.post("/", async (req, res) => {
  try {
    const { streets = [], ...societyData } = req.body;

    const count = await Society.countDocuments();
    if (count > 0) {
      return res.status(400).json({
        message: "Only one society can be created. Please edit the existing society.",
      });
    }

    const society = new Society({
      ...societyData,
      totalStreet: streets.length,
    });
    await society.save();

    if (streets.length > 0) {
      const streetDocs = streets.map((street) => ({
        ...street,
        societyId: society._id,
      }));
      await Street.insertMany(streetDocs);
    }

    const saved = await Society.findById(society._id);
    res.status(201).json(saved);
  } catch (err) {
    console.error("POST /societies error:", err);
    res.status(400).json({ message: err.message });
  }
});

// PUT update society + streets
router.put("/:id", async (req, res) => {
  try {
    const { streets = [], ...societyData } = req.body;
    const societyId = req.params.id;

    const updatedSociety = await Society.findByIdAndUpdate(
      societyId,
      {
        ...societyData,
        DateUpdated: new Date(),
        totalStreet: streets.length,
      },
      { new: true }
    );

    await Street.deleteMany({ societyId });
    if (streets.length > 0) {
      const streetDocs = streets.map((street) => ({
        ...street,
        societyId,
      }));
      await Street.insertMany(streetDocs);
    }

    res.json(updatedSociety);
  } catch (err) {
    console.error("PUT /societies/:id error:", err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE society + all streets
// router.delete("/:id", async (req, res) => {
//   try {
//     const societyId = req.params.id;
//     await Street.deleteMany({ societyId });
//     await Society.findByIdAndDelete(societyId);
//     res.json({ message: "Society and all streets deleted successfully" });
//   } catch (err) {
//     console.error("DELETE /societies/:id error:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

router.delete("/:id", async (req, res) => {
  try {
    const societyId = req.params.id;
    
    // Start MongoDB session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // 1. Delete all streets in this society
      const streets = await Street.find({ societyId }, null, { session });
      const streetIds = streets.map(street => street._id);
      
      // 2. Delete all homes in these streets
      await Home.deleteMany({ StreetID: { $in: streetIds } }, { session });
      
      // 3. Find all users in this society (through assign home relationships)
      // First get all assign home records
      const homes = await Home.find({ StreetID: { $in: streetIds } }, null, { session });
      const homeIds = homes.map(home => home._id);
      
      const assignHomes = await AssignHome.find({ HomeID: { $in: homeIds } }, null, { session });
      const assignHomeIds = assignHomes.map(assign => assign._id);
      const userIds = assignHomes.map(assign => assign.UserID);
      
      // 4. Delete all appointments for these assign homes
      await Appointment.deleteMany({ AssignID: { $in: assignHomeIds } }, { session });
      
      // 5. Delete all payments for these assign homes
      await Payment.deleteMany({ AssignID: { $in: assignHomeIds } }, { session });
      
      // 6. Delete all assign home records
      await AssignHome.deleteMany({ HomeID: { $in: homeIds } }, { session });
      
      // 7. Delete all complaints by these users
      await Complaint.deleteMany({ UserID: { $in: userIds } }, { session });
      
      // 8. Delete all feedback by these users (if ComplaintID exists)
      await Feedback.deleteMany({ UserID: { $in: userIds } }, { session });
      
      // 9. Delete all hall bookings by these users
      await Hall.deleteMany({ UserID: { $in: userIds } }, { session });
      
      // 10. Delete all secretory records for these users
      await Secretory.deleteMany({ UserID: { $in: userIds } }, { session });
      
      // 11. Delete the users themselves
      await User.deleteMany({ _id: { $in: userIds } }, { session });
      
      // 12. Delete maintenance records (optional: if they're society-specific)
      // You might need to add societyId to Maintenance model or handle differently
      
      // 13. Delete announcements (optional: if they're society-specific)
      // You might need to add societyId to Announcement model or handle differently
      
      // 14. Delete the streets
      await Street.deleteMany({ societyId }, { session });
      
      // 15. Finally delete the society itself
      await Society.findByIdAndDelete(societyId, { session });
      
      // Commit the transaction
      await session.commitTransaction();
      
      res.json({ 
        message: "Society and all related data (streets, homes, users, payments, etc.) deleted successfully" 
      });
    } catch (error) {
      // Rollback if any error occurs
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
    
  } catch (err) {
    console.error("DELETE /societies/:id error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
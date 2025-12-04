// import express from "express";
// import Announcement from "../models/Announcement.js";

// const router = express.Router();


// // 🟢 CREATE – Add new announcement
// router.post("/create", async (req, res) => {
//   try {
//     const { Description, ProgramDate } = req.body;

//     const newAnnouncement = new Announcement({
//       Description,
//       ProgramDate,
//     });

//     await newAnnouncement.save();
//     res.status(201).json({ message: "Announcement added successfully!" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// // 🔵 READ – Get all active announcements
// // router.get("/", async (req, res) => {
// //   try {
// //     const announcements = await Announcement.find({ IsActive: true }).sort({ DateCreated: -1 });
// //     res.json(announcements);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // 🟢 READ – Get all announcements (active + inactive)
// router.get("/", async (req, res) => {
//   try {
//     const announcements = await Announcement.find().sort({ DateCreated: -1 });
//     res.json(announcements);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });



// // 🟡 UPDATE – Edit announcement details
// router.put("/update/:id", async (req, res) => {
//   try {
//     const { Description, ProgramDate } = req.body;

//     const updated = await Announcement.findByIdAndUpdate(
//       req.params.id,
//       {
//         Description,
//         ProgramDate,
//         DateUpdated: new Date(),
//       },
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ message: "Announcement not found" });
//     }

//     res.json({ message: "Announcement updated successfully!", updated });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// // 🔴 SOFT DELETE – Mark announcement as inactive
// router.put("/delete/:id", async (req, res) => {
//   try {
//     const deleted = await Announcement.findByIdAndUpdate(
//       req.params.id,
//       { IsActive: false, DateUpdated: new Date() },
//       { new: true }
//     );

//     if (!deleted) {
//       return res.status(404).json({ message: "Announcement not found" });
//     }

//     res.json({ message: "Announcement marked as inactive (soft deleted)." });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// // 🟠 OPTIONAL – Restore soft-deleted announcement
// router.put("/restore/:id", async (req, res) => {
//   try {
//     const restored = await Announcement.findByIdAndUpdate(
//       req.params.id,
//       { IsActive: true, DateUpdated: new Date() },
//       { new: true }
//     );

//     if (!restored) {
//       return res.status(404).json({ message: "Announcement not found" });
//     }

//     res.json({ message: "Announcement restored successfully!" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// export default router;



//with notification
import express from "express";
import Announcement from "../models/Announcement.js";
import { io } from "../server.js";

const router = express.Router();

// 🟢 CREATE – Add new announcement + send notifications
router.post("/create", async (req, res) => {
  try {
    const { Description, ProgramDate } = req.body;

    const newAnnouncement = new Announcement({
      Description,
      ProgramDate,
    });

    await newAnnouncement.save();

    const notificationData = {
      id: newAnnouncement._id,
      title: (Description || "").substring(0, 50) + "...",
      message: "🔔 Secretary ne naya announcement kiya!",
      description: Description,
      date: new Date().toLocaleString("en-IN"),
      type: "announcement",
    };

    io.to("Owner").emit("new-announcement", notificationData);
    console.log("📢 Notification sent to Owner room");
    io.to("Tenant").emit("new-announcement", notificationData);
    console.log("📢 Notification sent to Tenant room");

    res
      .status(201)
      .json({ message: "Announcement added successfully!", announcement: newAnnouncement });
  } catch (error) {
    console.error("Announcement create error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🔵 READ – Get all announcements
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ DateCreated: -1 });
  res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟡 UPDATE
router.put("/update/:id", async (req, res) => {
  try {
    const { Description, ProgramDate } = req.body;

    const updated = await Announcement.findByIdAndUpdate(
      req.params.id,
      {
        Description,
        ProgramDate,
        DateUpdated: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json({ message: "Announcement updated successfully!", updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔴 SOFT DELETE
router.put("/delete/:id", async (req, res) => {
  try {
    const deleted = await Announcement.findByIdAndUpdate(
      req.params.id,
      { IsActive: false, DateUpdated: new Date() },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json({ message: "Announcement marked as inactive (soft deleted)." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟠 RESTORE
router.put("/restore/:id", async (req, res) => {
  try {
    const restored = await Announcement.findByIdAndUpdate(
      req.params.id,
      { IsActive: true, DateUpdated: new Date() },
      { new: true }
    );

    if (!restored) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json({ message: "Announcement restored successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
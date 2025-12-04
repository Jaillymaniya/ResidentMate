// import express from "express";
// import Hall from "../models/Hall.js";
// import User from "../models/User.js";

// const router = express.Router();

// // --------------------- BOOK HALL ---------------------
// // router.post("/book", async (req, res) => {
// //   try {
// //     const { email, FromDate, ToDate, EventName, Purpose } = req.body;

// //     if (!email || !FromDate || !ToDate || !EventName) {
// //       return res.status(400).json({ message: "All required fields must be provided" });
// //     }

// //     const user = await User.findOne({ UserEmailID: email });
// //     if (!user) return res.status(404).json({ message: "User not found" });

// //     const hallBooking = new Hall({
// //       UserID: user._id,
// //       FromDate,
// //       ToDate,
// //       EventName,
// //       Purpose,
// //     });

// //     await hallBooking.save();
// //     res.status(201).json({ message: "Hall booked successfully", hallBooking });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });


// router.post("/book", async (req, res) => {
//   try {
//     const { email, FromDate, ToDate, EventName, Purpose } = req.body;

//     if (!email || !FromDate || !ToDate || !EventName) {
//       return res.status(400).json({ message: "All required fields must be provided" });
//     }

//     const user = await User.findOne({ UserEmailID: email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // ❌ CHECK DATE OVERLAP WITH APPROVED BOOKINGS
//     const conflict = await Hall.findOne({
//       Status: "Approved",
//       $and: [
//         { FromDate: { $lte: new Date(ToDate) } },
//         { ToDate: { $gte: new Date(FromDate) } }
//       ]
//     });

//     if (conflict) {
//       return res.status(400).json({
//         message: "Hall already booked for selected dates!"
//       });
//     }

//     // ----------------------------- SAVE BOOKING -----------------------------
//     const hallBooking = new Hall({
//       UserID: user._id,
//       FromDate: new Date(FromDate),
//       ToDate: new Date(ToDate),
//       EventName,
//       Purpose,
//     });

//     await hallBooking.save();
//     res.status(201).json({ message: "Hall booked successfully", hallBooking });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// // --------------------- VIEW MY BOOKINGS ---------------------
// router.get("/my-bookings/:email", async (req, res) => {
//   try {
//     const email = req.params.email;
//     const user = await User.findOne({ UserEmailID: email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const halls = await Hall.find({ UserID: user._id });
//     res.status(200).json(halls);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // --------------------- EDIT BOOKING ---------------------
// router.put("/edit/:id", async (req, res) => {
//   try {
//     const { email, FromDate, ToDate, EventName, Purpose, Status } = req.body;

//     const user = await User.findOne({ UserEmailID: email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const hall = await Hall.findOne({ _id: req.params.id, UserID: user._id });
//     if (!hall) return res.status(404).json({ message: "Booking not found for this user" });

//     if (FromDate) hall.FromDate = FromDate;
//     if (ToDate) hall.ToDate = ToDate;
//     if (EventName) hall.EventName = EventName;
//     if (Purpose) hall.Purpose = Purpose;
//     if (Status) hall.Status = Status;

//     await hall.save();
//     res.status(200).json({ message: "Booking updated successfully", hall });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // --------------------- DELETE BOOKING ---------------------
// router.delete("/delete/:id/:email", async (req, res) => {
//   try {
//     const email = req.params.email;
//     const user = await User.findOne({ UserEmailID: email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const hall = await Hall.findOneAndDelete({ _id: req.params.id, UserID: user._id });
//     if (!hall) return res.status(404).json({ message: "Booking not found for this user" });

//     res.status(200).json({ message: "Booking deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // --------------------- VIEW ALL BOOKINGS ---------------------
// router.get("/all-bookings", async (req, res) => {
//   try {
//     const halls = await Hall.find().populate("UserID", "UserEmailID UserName"); 
//     // populate to show user info like email and name
//     res.status(200).json(halls);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// // --------------------- UPDATE BOOKING STATUS ---------------------
// // router.put("/update-status/:id", async (req, res) => {
// //   try {
// //     const { Status } = req.body;

// //     // Validate status
// //     if (!Status || !["Pending", "Approved", "Rejected"].includes(Status)) {
// //       return res.status(400).json({ message: "Invalid status" });
// //     }

// //     // Find booking by ID
// //     const hall = await Hall.findById(req.params.id);
// //     if (!hall) return res.status(404).json({ message: "Booking not found" });

// //     hall.Status = Status;
// //     await hall.save();

// //     res.status(200).json({ message: `Booking ${Status.toLowerCase()} successfully`, hall });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// router.put("/update-status/:id", async (req, res) => {
//   try {
//     const { Status } = req.body;

//     // Validate status
//     if (!Status || !["Pending", "Approved", "Rejected"].includes(Status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     // Find booking by ID
//     const hall = await Hall.findById(req.params.id);
//     if (!hall) return res.status(404).json({ message: "Booking not found" });

//     // -----------------❌ CHECK CONFLICT ONLY WHEN APPROVING -----------------
//     if (Status === "Approved") {
//       const conflict = await Hall.findOne({
//         _id: { $ne: hall._id },      // exclude same booking
//         Status: "Approved",          // check only approved ones
//         $and: [
//           { FromDate: { $lte: hall.ToDate } },
//           { ToDate: { $gte: hall.FromDate } }
//         ]
//       });

//       if (conflict) {
//         return res.status(400).json({
//           message: "Cannot approve! Hall is already booked for these dates.",
//           conflictBooking: conflict
//         });
//       }
//     }

//     // ----------------- UPDATE STATUS -----------------
//     hall.Status = Status;
//     await hall.save();

//     res.status(200).json({
//       message: `Booking ${Status.toLowerCase()} successfully`,
//       hall
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });




// export default router;


import express from "express";
import Hall from "../models/Hall.js";
import User from "../models/User.js";

const router = express.Router();

// --------------------- BOOK HALL ---------------------
router.post("/book", async (req, res) => {
  try {
    const { email, FromDate, ToDate, EventName, Purpose } = req.body;

    if (!email || !FromDate || !ToDate || !EventName) {
      return res.status(400).json({ message: "Please provide email, from date, to date, and event name." });
    }

    const user = await User.findOne({ UserEmailID: email });
    if (!user) return res.status(404).json({ message: `No user found with email: ${email}` });

    // Check for date conflicts with approved bookings
    const conflict = await Hall.findOne({
      Status: "Approved",
      $and: [
        { FromDate: { $lte: new Date(ToDate) } },
        { ToDate: { $gte: new Date(FromDate) } }
      ]
    });

    if (conflict) {
      return res.status(400).json({
        message: `Sorry! Hall is already booked from ${conflict.FromDate.toDateString()} to ${conflict.ToDate.toDateString()} for another event (${conflict.EventName}).`
      });
    }

    const hallBooking = new Hall({
      UserID: user._id,
      FromDate: new Date(FromDate),
      ToDate: new Date(ToDate),
      EventName,
      Purpose,
    });

    await hallBooking.save();
    res.status(201).json({ message: "Hall booked successfully!", hallBooking });

  } catch (err) {
    res.status(500).json({ message: "Server error occurred while booking the hall.", error: err.message });
  }
});

// --------------------- VIEW MY BOOKINGS ---------------------
router.get("/my-bookings/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ UserEmailID: email });
    if (!user) return res.status(404).json({ message: `No user found with email: ${email}` });

    const halls = await Hall.find({ UserID: user._id });
    if (halls.length === 0) return res.status(200).json({ message: "You have not booked any halls yet." });

    res.status(200).json(halls);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve your bookings.", error: err.message });
  }
});

// --------------------- EDIT BOOKING ---------------------
router.put("/edit/:id", async (req, res) => {
  try {
    const { email, FromDate, ToDate, EventName, Purpose, Status } = req.body;

    const user = await User.findOne({ UserEmailID: email });
    if (!user) return res.status(404).json({ message: `No user found with email: ${email}` });

    const hall = await Hall.findOne({ _id: req.params.id, UserID: user._id });
    if (!hall) return res.status(404).json({ message: "Booking not found for this user." });

    if (FromDate) hall.FromDate = new Date(FromDate);
    if (ToDate) hall.ToDate = new Date(ToDate);
    if (EventName) hall.EventName = EventName;
    if (Purpose) hall.Purpose = Purpose;
    if (Status) hall.Status = Status;

    await hall.save();
    res.status(200).json({ message: "Booking updated successfully!", hall });

  } catch (err) {
    res.status(500).json({ message: "Failed to update the booking.", error: err.message });
  }
});

// --------------------- DELETE BOOKING ---------------------
router.delete("/delete/:id/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ UserEmailID: email });
    if (!user) return res.status(404).json({ message: `No user found with email: ${email}` });

    const hall = await Hall.findOneAndDelete({ _id: req.params.id, UserID: user._id });
    if (!hall) return res.status(404).json({ message: "No booking found for this user to delete." });

    res.status(200).json({ message: "Booking deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete the booking.", error: err.message });
  }
});

// --------------------- VIEW ALL BOOKINGS ---------------------
router.get("/all-bookings", async (req, res) => {
  try {
    const halls = await Hall.find().populate("UserID", "UserEmailID UserName");
    if (halls.length === 0) return res.status(200).json({ message: "No hall bookings found." });

    res.status(200).json(halls);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve all bookings.", error: err.message });
  }
});

// --------------------- UPDATE BOOKING STATUS ---------------------
router.put("/update-status/:id", async (req, res) => {
  try {
    const { Status } = req.body;

    if (!Status || !["Pending", "Approved", "Rejected"].includes(Status)) {
      return res.status(400).json({ message: "Status must be one of 'Pending', 'Approved', or 'Rejected'." });
    }

    const hall = await Hall.findById(req.params.id);
    if (!hall) return res.status(404).json({ message: "Booking not found." });

    if (Status === "Approved") {
      const conflict = await Hall.findOne({
        _id: { $ne: hall._id },
        Status: "Approved",
        $and: [
          { FromDate: { $lte: hall.ToDate } },
          { ToDate: { $gte: hall.FromDate } }
        ]
      });

      if (conflict) {
        return res.status(400).json({
          message: `Cannot approve booking! Hall is already booked from ${conflict.FromDate.toDateString()} to ${conflict.ToDate.toDateString()} for event "${conflict.EventName}".`,
          conflictBooking: conflict
        });
      }
    }

    hall.Status = Status;
    await hall.save();

    res.status(200).json({ message: `Booking ${Status.toLowerCase()} successfully!`, hall });

  } catch (err) {
    res.status(500).json({ message: "Failed to update booking status.", error: err.message });
  }
});

export default router;

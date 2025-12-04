import express from "express";
import Maintenance from "../models/Maintenance.js";
import Payment from "../models/Payment.js";

const router = express.Router();

// Get all active maintenance records
router.get("/maintenance", async (req, res) => {
  try {
    const records = await Maintenance.find({ IsDeleted: false })
      .sort({ MaintenanceFrom: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create maintenance
// router.post("/maintenance", async (req, res) => {
//   try {
//     const { Amount, FromDate, ToDate, DueDate } = req.body;

//     const newRec = await Maintenance.create({
//       Amount,
//       FromDate,
//       ToDate,
//       DueDate
//     });

//     res.status(201).json(newRec);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

router.post("/maintenance", async (req, res) => {
  try {
    const { Amount, FromDate, ToDate, DueDate } = req.body;

    // 1. Amount must be positive
    if (!Amount || Amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    // 2. FromDate <= ToDate
    if (new Date(FromDate) > new Date(ToDate)) {
      return res.status(400).json({ message: "FromDate cannot be after ToDate" });
    }

    // 3. DueDate >= ToDate
    if (new Date(DueDate) < new Date(ToDate)) {
      return res.status(400).json({ message: "DueDate cannot be before ToDate" });
    }

    // 4. overlapping check
    const exists = await Maintenance.findOne({
      IsDeleted: false,
      FromDate: { $lte: ToDate },
      ToDate: { $gte: FromDate }
    });

    if (exists) {
      return res.status(400).json({ message: "Maintenance for this period already exists" });
    }

    // 5. exact duplicate
    const exact = await Maintenance.findOne({ Amount, FromDate, ToDate, IsDeleted: false });
    if (exact) {
      return res.status(400).json({ message: "Same maintenance already exists" });
    }

    // CREATE
    const newRec = await Maintenance.create({
      Amount,
      FromDate,
      ToDate,
      DueDate
    });

    res.status(201).json(newRec);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// Update maintenance
// router.put("/maintenance/:id", async (req, res) => {
//   try {
//     const { Amount, FromDate, ToDate, DueDate } = req.body;

//     const updated = await Maintenance.findByIdAndUpdate(
//       req.params.id,
//       {
//         Amount,
//         FromDate,
//         ToDate,
//         DueDate,
//         DateUpdated: new Date()
//       },
//       { new: true }
//     );

//     if (!updated)
//       return res.status(404).json({ message: "Record not found" });

//     res.json(updated);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

router.put("/maintenance/:id", async (req, res) => {
  try {
    const maintenanceId = req.params.id;
    const { Amount, FromDate, ToDate, DueDate } = req.body;

    // Check paid
    const paymentExists = await Payment.findOne({
      MaintenanceID: maintenanceId,
      PaymentStatus: "Paid"
    });

    if (paymentExists) {
      return res.status(400).json({
        message: "Cannot update. Owners have already paid for this maintenance."
      });
    }

    // Check payment generated
    const paymentGenerated = await Payment.findOne({ MaintenanceID: maintenanceId });

    if (paymentGenerated && (Amount || FromDate || ToDate)) {
      return res.status(400).json({
        message: "Cannot modify amount or period. Payments already generated."
      });
    }

    // Validation before update
    if (FromDate && ToDate && new Date(FromDate) > new Date(ToDate)) {
      return res.status(400).json({ message: "FromDate cannot be after ToDate" });
    }

    if (DueDate && new Date(DueDate) < new Date(ToDate)) {
      return res.status(400).json({ message: "DueDate cannot be before ToDate" });
    }

    // Overlap validation
    if (FromDate && ToDate) {
      const overlap = await Maintenance.findOne({
        _id: { $ne: maintenanceId },
        IsDeleted: false,
        FromDate: { $lte: ToDate },
        ToDate: { $gte: FromDate }
      });

      if (overlap) {
        return res.status(400).json({
          message: "Updated dates overlap with another maintenance record"
        });
      }
    }

    const updated = await Maintenance.findByIdAndUpdate(
      maintenanceId,
      { ...req.body, DateUpdated: new Date() },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// SOFT DELETE maintenance
// router.delete("/maintenance/:id", async (req, res) => {
//   try {
//     const deleted = await Maintenance.findByIdAndUpdate(
//       req.params.id,
//       { IsDeleted: true, DateUpdated: new Date() },
//       { new: true }
//     );

//     if (!deleted)
//       return res.status(404).json({ message: "Record not found" });

//     res.json({ message: "Record soft deleted" });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

router.delete("/maintenance/:id", async (req, res) => {
  try {
    const maintenanceId = req.params.id;

    const paymentExists = await Payment.findOne({
      MaintenanceID: maintenanceId,
      PaymentStatus: "Paid"
    });

    if (paymentExists) {
      return res.status(400).json({
        message: "Cannot delete. Owners have already paid for this maintenance."
      });
    }

    const deleted = await Maintenance.findByIdAndUpdate(
      maintenanceId,
      { IsDeleted: true, DateUpdated: new Date() },
      { new: true }
    );

    if (!deleted)
      return res.status(404).json({ message: "Record not found" });

    res.json({ message: "Record soft deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// GET /api/maintenance/deleted
router.get("/maintenance/deleted", async (req, res) => {
  try {
    const deletedRecords = await Maintenance.find({ IsDeleted: true });
    res.json(deletedRecords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// router.get("/maintenance/active", async (req, res) => {
//   try {
//     const deletedRecords = await Maintenance.find({ IsDeleted: false });
//     res.json(deletedRecords);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

router.get("/maintenance/active", async (req, res) => {
  try {
    const maintenance = await Maintenance.find()
      .lean();

    // fetch payments
    const payments = await Payment.find().lean();

    // Attach paymentId ⬇
    const result = maintenance.map(m => {
      const pay = payments.find(p => p.MaintenanceID.toString() === m._id.toString());
      return {
        ...m,
        paymentId: pay ? pay._id : null
      };
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


export default router;

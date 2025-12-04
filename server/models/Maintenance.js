// // models/Maintenance.js
// import mongoose from "mongoose";

// const maintenanceSchema = new mongoose.Schema({
//   Amount: { type: Number, required: true },
//   DueDate: { type: Date, required: true },
//   DateCreated: { type: Date, default: Date.now },
//   DateUpdated: { type: Date }
// }, { collection: "Tbl_Maintenance" });

// export default mongoose.models.Tbl_Maintenance || mongoose.model("Tbl_Maintenance", maintenanceSchema);


// models/Maintenance.js
import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    Amount: {
      type: Number,
      required: true,
    },

    // Maintenance applicable from
    FromDate: {
      type: Date,
      required: true,
    },

    // Maintenance applicable to
    ToDate: {
      type: Date,
      required: true,
    },

    // Payment due date
    DueDate: {
      type: Date,
      required: true,
    },

    IsDeleted: { type: Boolean, default: false },

    DateCreated: {
      type: Date,
      default: Date.now,
    },

    DateUpdated: {
      type: Date,
    },
  },
  { collection: "Tbl_Maintenance" }
);

export default
  mongoose.models.Tbl_Maintenance ||
  mongoose.model("Tbl_Maintenance", maintenanceSchema);

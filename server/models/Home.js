import mongoose from "mongoose";

const homeSchema = new mongoose.Schema({
  StreetID: { type: mongoose.Schema.Types.ObjectId, ref: "Street", required: true },
  HomePhoto: { type: String, maxlength: 255 }, // optional
  HomeNumber: { type: String, maxlength: 20, required: true },
  Furnishing: { type: String, maxlength: 50 },
  IsRental: { type: Boolean, default: false },
  Status: { type: String, enum: ["Occupied", "Available"], default: "Available" },
  Rent: { type: Number, default: 0 },
  TenantPreferred: { type: String, maxlength: 100 },
  DateCreated: { type: Date, default: Date.now },
  DateUpdated: { type: Date }
});

export default mongoose.model("Tbl_Home", homeSchema);  
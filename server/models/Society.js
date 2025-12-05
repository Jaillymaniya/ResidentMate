import mongoose from "mongoose";

const SocietySchema = new mongoose.Schema({
  SocietyName: { type: String, required: true },
  Area: { type: String, required: true },
  City: { type: String, required: true },
  State: { type: String },
  Pincode: { type: String },
  totalStreet: { type: Number, default: 0 },
  DateCreated: { type: Date, default: Date.now },
  DateUpdated: { type: Date },
});

export default mongoose.model("Society", SocietySchema);

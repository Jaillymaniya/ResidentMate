import mongoose from "mongoose";

const hallSchema = new mongoose.Schema({
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tbl_Users",
    required: true,
  },

  FromDate: {
    type: Date,
    required: true,
  },

  ToDate: {
    type: Date,
    required: true,
  },

  EventName: {
    type: String,
    required: true,
    maxlength: 100,
  },

  Status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },

  Purpose: {
    type: String,
    maxlength: 50,
    default: "",
  },

  DateBooking: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Hall", hallSchema);

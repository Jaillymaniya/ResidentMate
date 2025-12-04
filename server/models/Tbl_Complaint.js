import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  ComplaintDescription: {
    type: String,
    required: true,
    maxlength: 500,
  },
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tbl_Users",
    required: true,
  },
  DateCreated: {
    type: Date, 
    default: Date.now,
  },
  DateUpdated: {
    type: Date,
    default: null,
  },
  Status: {
    type: String,
    enum: ["Pending", "Resolved", "Rejected"],
    default: "Pending",
  },
});

const Tbl_Complaint = mongoose.model("Tbl_Complaint", complaintSchema);

export default Tbl_Complaint;

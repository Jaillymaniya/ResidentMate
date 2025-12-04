import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ComplaintID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tbl_Complaint",
    required: true,
  },
  Rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  Comments: {
    type: String,
    maxlength: 300,
    default: "",
  },
  DateSubmitted: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Tbl_Feedback", FeedbackSchema);

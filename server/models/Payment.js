import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  AssignID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tbl_AssignHome",
    required: true
  },
  MaintenanceID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tbl_Maintenance",
    required: true
  },
  TransactionID: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100
  },
  PaymentStatus: {
    type: String,
    enum: ["Paid", "Pending"],
    required: true,
    default: "Pending"
  },
  PaymentDate: {
    type: Date,
    default: null
  },
  ReceiptPath: {
    type: String,
    maxlength: 255,
    default: null
  },
  DateAdded: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Payment", PaymentSchema);

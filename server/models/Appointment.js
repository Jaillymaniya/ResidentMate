import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  // HomeID: { type: mongoose.Schema.Types.ObjectId, ref: "Tbl_Houses", required: true }, // Link to the home
   AssignID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Tbl_AssignHome", 
    required: true 
  },   
  TenantName: { type: String, required: true },
  TenantEmail: { type: String, required: true },
  TenantContact: { type: String, required: true },
  RequestDate: { type: Date, default: Date.now },
  Status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" }
});

const Appointment = mongoose.model("Tbl_Appointment", appointmentSchema);
export default Appointment;

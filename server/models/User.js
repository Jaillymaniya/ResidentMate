import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  UserName: { type: String, required: true, maxlength: 100 },
  UserGender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  UserCNo: { type: String, required: true, unique: true, maxlength: 10 },
  Role: { type: String, enum: ["Admin", "Owner", "Tenant"], default: "Owner" },
  Password: { type: String, required: true, maxlength: 255 },
  UserEmailID: { type: String, required: true, unique: true, maxlength: 100 },
  Status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  Photo: { type: String, maxlength: 255, default: null },
  DateCreated: { type: Date, default: Date.now },
  DateUpdated: { type: Date, default: Date.now }
});

userSchema.pre("save", function (next) {
  this.DateUpdated = new Date();
  next();
});

const userModel = mongoose.models.Tbl_Users || mongoose.model("Tbl_Users", userSchema);
export default userModel;

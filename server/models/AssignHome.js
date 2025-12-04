// import mongoose from "mongoose";

// const assignHomeSchema = new mongoose.Schema({
//   UserID: { type: mongoose.Schema.Types.ObjectId, ref: "Tbl_Users", required: true },
//   HomeID: { type: mongoose.Schema.Types.ObjectId, ref: "Tbl_Home", required: true },
//   RelationType: { type: String, enum: ["Owner", "Tenant"], required: true },
//   AssignedDate: { type: Date, default: Date.now },
//   DateCreated: { type: Date, default: Date.now },
//   DateUpdated: { type: Date }
// });

// export default mongoose.model("Tbl_AssignHome", assignHomeSchema);


import mongoose from "mongoose";

const assignHomeSchema = new mongoose.Schema({
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: "Tbl_Users", required: true },
  HomeID: { type: mongoose.Schema.Types.ObjectId, ref: "Tbl_Home", required: true },
  RelationType: { type: String, enum: ["Owner", "Tenant"], required: true },
  AssignedDate: { type: Date, default: Date.now },
  DateCreated: { type: Date, default: Date.now },
  DateUpdated: { type: Date, default: Date.now }
});

// Auto-update DateUpdated on save
assignHomeSchema.pre("save", function (next) {
  this.DateUpdated = new Date();
  next();
});

export default mongoose.model("Tbl_AssignHome", assignHomeSchema);

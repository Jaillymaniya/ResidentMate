// // server/models/Secretory.js
// import mongoose from "mongoose";

// const secretorySchema = new mongoose.Schema({
//   UserID: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Tbl_Users",
//     required: true
//   },
//   role: {
//     type: String,
//     default: "Secretary"
//   },
//   DateCreated: {
//     type: Date,
//     default: Date.now
//   }
// });

// export default mongoose.models.Tbl_Secretory || mongoose.model("Tbl_Secretory", secretorySchema);



// server/models/Secretory.js
// import mongoose from "mongoose";

// const secretorySchema = new mongoose.Schema({
//   UserID: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Tbl_Users",  // ✅ Make sure this matches your User model's collection name
//     required: true
//   },
//   role: {
//     type: String,
//     default: "Secretary"
//   },
//   DateCreated: {
//     type: Date,
//     default: Date.now
//   }
// });

// export default mongoose.models.Tbl_Secretory || mongoose.model("Tbl_Secretory", secretorySchema);


import mongoose from "mongoose";

const secretorySchema = new mongoose.Schema({
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tbl_Users",
    required: true
  },
  role: {
    type: String,
    default: "Secretary"
  },
  DateCreated: {
    type: Date,
    default: Date.now
  }
}, { collection: "Tbl_Secretory" });  // 👈 explicitly set the collection name

export default mongoose.models.Tbl_Secretory || mongoose.model("Tbl_Secretory", secretorySchema);

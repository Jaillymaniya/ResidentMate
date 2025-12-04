// import mongoose from "mongoose";

// const announcementSchema = new mongoose.Schema({
//   Description: {
//     type: String,
//     required: true,
//     maxlength: 100,
//   },
//   ProgramDate: {
//     type: Date,
//     default: null, // Optional field
//   },
//   DateCreated: {
//     type: Date,
//     default: Date.now, // Automatically set current date
//   },
// });

// // export default mongoose.model("Tbl_Announcement", announcementSchema);
// const Announcement = mongoose.model("Announcement", announcementSchema);

// export default Announcement;

import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  Description: {
    type: String,
    required: true,
    maxlength: 100,
  },
  ProgramDate: {
    type: Date,
    default: null,
  },
  DateCreated: {
    type: Date,
    default: Date.now,
  },
  DateUpdated: {
    type: Date,
    default: null,
  },
  IsActive: {
    type: Boolean,
    default: true, // true = active, false = inactive
  },
});

const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;

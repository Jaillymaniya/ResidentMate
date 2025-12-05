import mongoose from "mongoose";

const StreetSchema = new mongoose.Schema({
  societyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Society",
    required: true,
  },

  streetNumber: {
    type: String,
    required: true,
  },

  streetArea: {
    type: String,
    required: false,
  },

  totalHome: {
    type: Number,
    default: 0,
  },

  // ✅ type = 2BHK, 3BHK, 4BHK only
  type: {
    type: String,
    enum: ["1BHK", "2BHK", "3BHK", "4BHK"], // jo options chaho add karo
    required: true,
  },

  homeArea: {
    type: String,
    required: false,
  },

  DateCreated: { type: Date, default: Date.now },
  DateUpdated: { type: Date },
});

const Street = mongoose.model("Street", StreetSchema);
export default Street;
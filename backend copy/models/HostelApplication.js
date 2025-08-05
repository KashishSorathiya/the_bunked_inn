const mongoose = require("mongoose");

const hostelApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // One student = One hostel application
  },
   rollNumber: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
  applicationStatus: {
    type: Boolean,
    default: false,
  },
  isApplicationApproved: {
    type: Boolean,
    default: false,
  },
  roomNumber: {
    type: String,
    default: "",
  },
}, { timestamps: true });

module.exports = mongoose.model("HostelApplication", hostelApplicationSchema);

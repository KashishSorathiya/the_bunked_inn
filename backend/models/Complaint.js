const mongoose = require("mongoose");
const complaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Resolved"],
    default: "Pending",
  },
}, { timestamps: true });
module.exports = mongoose.model("Complaint", complaintSchema);

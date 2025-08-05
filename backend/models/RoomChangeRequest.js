const mongoose = require("mongoose");

const roomChangeRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true },
  status: { type: String, default: "Pending" }, // Pending / Approved / Rejected
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RoomChangeRequest", roomChangeRequestSchema);

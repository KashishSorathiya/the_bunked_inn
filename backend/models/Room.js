const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  occupants: {
    type: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        course: String,
      },
    ],
    default: [], // ✅ ensures it's always an array
  },
}, { timestamps: true });

// ✅ Virtual for fixed capacity
roomSchema.virtual("capacity").get(function () {
  return 2;
});

// ✅ Virtual to check if room is full
roomSchema.virtual("isFull").get(function () {
  return this.occupants.length >= 2;
});

module.exports = mongoose.model("Room", roomSchema);

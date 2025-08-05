const express = require("express");
const router = express.Router();
const User = require("../models/User");
const HostelApplication = require("../models/HostelApplication");

router.post("/hostel-application/apply", async (req, res) => {
  try {
    const { userId, rollNumber, course } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if already applied
    const existingApplication = await HostelApplication.findOne({ userId });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for the hostel" });
    }

    // Create new application
    const newApplication = new HostelApplication({
      userId,
      rollNumber,
      course
    });

    await newApplication.save();

    res.status(200).json({ message: "Hostel application submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;

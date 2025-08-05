const HostelApplication = require("../models/HostelApplication");

exports.applyForHostel = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming req.user is populated via auth middleware

    // Check if already applied
    const existing = await HostelApplication.findOne({ userId });
    if (existing) return res.status(400).json({ message: "Hostel application already submitted" });

    const application = new HostelApplication({
      userId,
      applicationStatus: true,
    });

    await application.save();
    res.status(201).json({ message: "Hostel application submitted" });

  } catch (error) {
    res.status(500).json({ message: "Application failed", error: error.message });
  }
};

exports.verifyHostelApplication = async (req, res) => {
  try {
    const { userId, roomNumber } = req.body;

    const application = await HostelApplication.findOne({ userId });
    if (!application) return res.status(404).json({ message: "Application not found" });

    application.isHostelVerified = true;
    application.roomNumber = roomNumber;

    await application.save();
    res.status(200).json({ message: "Hostel application verified" });

  } catch (error) {
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
};

exports.getMyHostelStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const application = await HostelApplication.findOne({ userId });
    if (!application) return res.status(404).json({ message: "No application found" });

    res.status(200).json(application);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch status", error: error.message });
  }
};

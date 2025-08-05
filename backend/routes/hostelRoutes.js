const express = require("express");
const router = express.Router();

const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");
const {
  submitHostelApplication,
  getAllHostelApplications,
  updateHostelApplication,
} = require("../controllers/hostelApplicationController");

const HostelApplication = require("../models/HostelApplication");

// ✅ Student applies for hostel
router.post("/apply", authenticateUser, submitHostelApplication);

// ✅ Admin gets all applications
router.get("/", authenticateUser, authorizeRoles("admin"), getAllHostelApplications);

// ✅ Admin updates application status
router.put("/:id", authenticateUser, authorizeRoles("admin"), updateHostelApplication);

// ✅ Student fetches their own application
router.get("/me", authenticateUser, async (req, res) => {
  try {
    const application = await HostelApplication.findOne({ userId: req.user.id });

    if (!application) {
      return res.status(404).json({ message: "No hostel application found." });
    }

    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  submitComplaint,
  getAllComplaints,
  resolveComplaint,
  getMyComplaints,
} = require("../controllers/complaintController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Student submits complaint
router.post("/submit", authenticateUser, submitComplaint);

// Admin gets all complaints
router.get("/", authenticateUser, authorizeRoles("admin"), getAllComplaints);

// Admin resolves a complaint
router.put("/:id", authenticateUser, authorizeRoles("admin"), resolveComplaint);
router.get("/my", authenticateUser, getMyComplaints);
module.exports = router;

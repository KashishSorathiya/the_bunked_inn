const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controllers/adminStatsController");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");

// Only admin can access
router.get("/stats", authenticateUser, authorizeRoles("admin"), getAdminStats);

module.exports = router;

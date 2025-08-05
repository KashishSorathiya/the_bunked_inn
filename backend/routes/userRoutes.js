const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware");

// ✅ Return logged-in user profile
router.get("/profile", authenticateUser, async (req, res) => {
  res.json(req.user); // This sends back the user info (without password)
});

module.exports = router;

const express = require('express');
const router = express.Router();

const {
  submitRoomChangeRequest,
  getAllRoomChangeRequests,
  updateRoomChangeStatus
} = require('../controllers/roomChangeController');

const {
  authenticateUser,
  authorizeRoles
} = require('../middleware/authMiddleware');

// Student submits room change request
router.post('/submit', authenticateUser, submitRoomChangeRequest);

// Admin fetches all room change requests
router.get('/all', authenticateUser, authorizeRoles('admin'), getAllRoomChangeRequests);

// Admin updates request status (approve/reject)
router.put('/update/:requestId', authenticateUser, authorizeRoles('admin'), updateRoomChangeStatus);

module.exports = router; // ✅ MUST be like this

const express = require('express');
const router = express.Router();
const {
  submitHostelApplication,
  getAllHostelApplications,
  updateHostelApplication,
} = require('../controllers/hostelApplicationController');

const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

// ✅ POST: Student applies for hostel
router.post('/', authenticateUser, submitHostelApplication);

// ✅ GET: Admin fetches all hostel applications
router.get('/', authenticateUser, authorizeRoles('admin'), getAllHostelApplications);

// ✅ PUT: Admin updates application status (approve/reject)
router.put('/:id', authenticateUser, authorizeRoles('admin'), updateHostelApplication);

module.exports = router;

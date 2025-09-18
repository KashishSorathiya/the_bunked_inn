// backend/services/hostelApplicationService.js
const HostelApplication = require('../models/HostelApplication');
const User = require('../models/User');

const submitHostelApplicationService = async ({ userId, rollNumber, course, gender }) => {
  // check if already applied
  const existing = await HostelApplication.findOne({ userId });
  if (existing) {
    return { error: 'already_applied' };
  }

  // create new application
  const newApplication = new HostelApplication({ userId, rollNumber, course, gender });
  await newApplication.save();

  // update user applied status
  await User.findByIdAndUpdate(userId, { applied: true });

  return { success: true };
};

module.exports = { submitHostelApplicationService };

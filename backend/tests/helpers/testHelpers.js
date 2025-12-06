const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// Helper to generate test JWT token
const generateTestToken = (userId, role = 'student') => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Helper to create test user
const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: 'test@dau.ac.in',
    password: 'hashedpassword',
    role: 'student',
    ...overrides,
  };
  return await User.create(defaultUser);
};

// Helper to create admin user
const createTestAdmin = async (overrides = {}) => {
  return await createTestUser({ role: 'admin', ...overrides });
};

module.exports = {
  generateTestToken,
  createTestUser,
  createTestAdmin,
};


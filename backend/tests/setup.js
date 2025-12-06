const mongoose = require('mongoose');

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key';
process.env.MONGO_URI = 'mongodb://localhost:27017/test-db';

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});


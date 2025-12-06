const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { registerUser } = require('../../../controllers/authController');
const User = require('../../../models/User');

// Mock bcrypt
jest.mock('bcrypt');
const bcryptMock = bcrypt;

describe('Auth Controller', () => {
  let mockReq;
  let mockRes;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    bcryptMock.hash.mockResolvedValue('hashedpassword123');
  });

  afterEach(async () => {
    await User.deleteMany({});
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('registerUser', () => {
    test('should reject registration if user already exists', async () => {
      const uniqueEmail = `test${Date.now()}${Math.random()}@dau.ac.in`;
      await User.create({
        name: 'Existing User',
        email: uniqueEmail,
        password: 'hashedpassword',
      });

      mockReq.body = {
        name: 'New User',
        email: uniqueEmail,
        password: 'password123',
      };

      await registerUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User already exists' });
      expect(bcryptMock.hash).not.toHaveBeenCalled();
    });

    test('should handle registration errors', async () => {
      const uniqueEmail = `test${Date.now()}${Math.random()}@dau.ac.in`;
      mockReq.body = {
        name: 'John Doe',
        email: uniqueEmail,
        password: 'password123',
      };

      // Mock User.save to throw an error
      const originalSave = User.prototype.save;
      User.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      await registerUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Registration failed',
        error: 'Database error',
      });

      // Restore original save
      User.prototype.save = originalSave;
    });

    test('should hash password before saving', async () => {
      const uniqueEmail = `test${Date.now()}${Math.random()}@dau.ac.in`;
      mockReq.body = {
        name: 'John Doe',
        email: uniqueEmail,
        password: 'mypassword',
      };

      await registerUser(mockReq, mockRes);

      expect(bcryptMock.hash).toHaveBeenCalledWith('mypassword', 10);
      expect(bcryptMock.hash).toHaveBeenCalledTimes(1);
    });
  });
});


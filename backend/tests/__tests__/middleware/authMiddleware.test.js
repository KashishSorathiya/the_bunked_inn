const jwt = require('jsonwebtoken');
const { authenticateUser, authorizeRoles } = require('../../../middleware/authMiddleware');
const User = require('../../../models/User');
const mongoose = require('mongoose');

describe('Auth Middleware', () => {
  let testUser;
  let mockReq;
  let mockRes;
  let mockNext;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  beforeEach(async () => {
    const uniqueEmail = `test${Date.now()}${Math.random()}@dau.ac.in`;
    testUser = await User.create({
      name: 'Test User',
      email: uniqueEmail,
      password: 'hashedpassword',
      role: 'student',
    });

    mockReq = {
      headers: {},
      user: null,
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('authenticateUser', () => {
    test('should return 401 if no token provided', async () => {
      await authenticateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized: No token provided' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 401 if token does not start with Bearer', async () => {
      mockReq.headers.authorization = 'Invalid token';

      await authenticateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized: No token provided' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 401 if token is invalid', async () => {
      mockReq.headers.authorization = 'Bearer invalid-token';

      await authenticateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized: Invalid token' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 401 if user not found', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();
      const token = jwt.sign({ id: nonExistentUserId, role: 'student' }, process.env.JWT_SECRET);
      mockReq.headers.authorization = `Bearer ${token}`;

      await authenticateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized: User not found' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('authorizeRoles', () => {
    test('should allow access for authorized role', () => {
      mockReq.user = { role: 'admin' };
      const middleware = authorizeRoles('admin', 'student');

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('should deny access for unauthorized role', () => {
      mockReq.user = { role: 'student' };
      const middleware = authorizeRoles('admin');

      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Forbidden: Access denied' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should allow access for multiple authorized roles', () => {
      mockReq.user = { role: 'student' };
      const middleware = authorizeRoles('admin', 'student');

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});


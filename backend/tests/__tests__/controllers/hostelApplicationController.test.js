const mongoose = require('mongoose');
const { submitHostelApplication, getAllHostelApplications, updateHostelApplication } = require('../../../controllers/hostelApplicationController');
const HostelApplication = require('../../../models/HostelApplication');
const Room = require('../../../models/Room');
const User = require('../../../models/User');
const { submitHostelApplicationService } = require('../../../services/hostelApplicationService');

// Mock the service
jest.mock('../../../services/hostelApplicationService');

describe('HostelApplication Controller', () => {
  let testUser;
  let mockReq;
  let mockRes;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  beforeEach(async () => {
    const uniqueEmail = `test${Date.now()}${Math.random()}@dau.ac.in`;
    testUser = await User.create({
      name: 'Test User',
      email: uniqueEmail,
      password: 'hashedpassword',
    });

    mockReq = {
      user: { id: testUser._id },
      body: {},
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(async () => {
    await HostelApplication.deleteMany({});
    await Room.deleteMany({});
    await User.deleteMany({});
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('submitHostelApplication', () => {
    test('should submit hostel application successfully', async () => {
      mockReq.body = {
        rollNumber: '2024CS001',
        course: 'Computer Science',
        gender: 'male',
      };

      submitHostelApplicationService.mockResolvedValue({ success: true });

      await submitHostelApplication(mockReq, mockRes);

      expect(submitHostelApplicationService).toHaveBeenCalledWith({
        userId: testUser._id,
        rollNumber: '2024CS001',
        course: 'Computer Science',
        gender: 'male',
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Hostel application submitted successfully.',
      });
    });

    test('should reject if user already applied', async () => {
      mockReq.body = {
        rollNumber: '2024CS001',
        course: 'Computer Science',
        gender: 'male',
      };

      submitHostelApplicationService.mockResolvedValue({ error: 'already_applied' });

      await submitHostelApplication(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'You have already applied for hostel.',
      });
    });

    test('should handle server errors', async () => {
      mockReq.body = {
        rollNumber: '2024CS001',
        course: 'Computer Science',
        gender: 'male',
      };

      submitHostelApplicationService.mockRejectedValue(new Error('Service error'));

      await submitHostelApplication(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Server error.',
        error: 'Service error',
      });
    });
  });

  describe('getAllHostelApplications', () => {
    test('should return empty array when no applications exist', async () => {
      await getAllHostelApplications(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      const applications = mockRes.json.mock.calls[0][0];
      expect(applications).toEqual([]);
    });

    test('should handle errors when fetching applications', async () => {
      // Mock HostelApplication.find to throw error
      const originalFind = HostelApplication.find;
      HostelApplication.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockRejectedValue(new Error('Database error')),
        }),
      });

      await getAllHostelApplications(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Failed to fetch applications',
        error: 'Database error',
      });

      HostelApplication.find = originalFind;
    });
  });

  describe('updateHostelApplication', () => {
    test('should reject application successfully', async () => {
      const application = await HostelApplication.create({
        userId: testUser._id,
        rollNumber: '2024CS001',
        course: 'Computer Science',
        gender: 'male',
      });

      mockReq.params.id = application._id;
      mockReq.body = { isApplicationApproved: false };

      await updateHostelApplication(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Application rejected successfully.',
      });

      const updatedApplication = await HostelApplication.findById(application._id);
      expect(updatedApplication.applicationStatus).toBe('Rejected');
      expect(updatedApplication.isApplicationApproved).toBe(false);
    });

    test('should return 404 if application not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      mockReq.params.id = nonExistentId;
      mockReq.body = { isApplicationApproved: true };

      await updateHostelApplication(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Application not found.',
      });
    });

    test('should handle errors during room allocation', async () => {
      const application = await HostelApplication.create({
        userId: testUser._id,
        rollNumber: '2024CS001',
        course: 'Computer Science',
        gender: 'male',
      });

      mockReq.params.id = application._id;
      mockReq.body = { isApplicationApproved: true };

      // Mock Room.findOne to throw error
      const originalFindOne = Room.findOne;
      Room.findOne = jest.fn().mockRejectedValue(new Error('Room allocation error'));

      await updateHostelApplication(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Failed to process the application. Please try again.',
      });

      Room.findOne = originalFindOne;
    });
  });
});


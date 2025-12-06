const mongoose = require('mongoose');
const { submitRoomChangeRequest, getAllRoomChangeRequests, updateRoomChangeStatus } = require('../../../controllers/roomChangeController');
const RoomChangeRequest = require('../../../models/RoomChangeRequest');
const HostelApplication = require('../../../models/HostelApplication');
const Room = require('../../../models/Room');
const User = require('../../../models/User');

describe('RoomChange Controller', () => {
  let testUser;
  let testAdmin;
  let mockReq;
  let mockRes;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  beforeEach(async () => {
    const uniqueUserEmail = `test${Date.now()}${Math.random()}@dau.ac.in`;
    const uniqueAdminEmail = `admin${Date.now()}${Math.random()}@dau.ac.in`;

    testUser = await User.create({
      name: 'Test User',
      email: uniqueUserEmail,
      password: 'hashedpassword',
      role: 'student',
    });

    testAdmin = await User.create({
      name: 'Test Admin',
      email: uniqueAdminEmail,
      password: 'hashedpassword',
      role: 'admin',
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
    await RoomChangeRequest.deleteMany({});
    await HostelApplication.deleteMany({});
    await Room.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('submitRoomChangeRequest', () => {
    test('should submit room change request successfully', async () => {
      mockReq.body = {
        reason: 'Need to change room due to personal reasons',
        currentRoom: 'B-101',
      };

      await submitRoomChangeRequest(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Room change request submitted successfully.',
      });

      const request = await RoomChangeRequest.findOne({ userId: testUser._id });
      expect(request).toBeDefined();
      expect(request.reason).toBe('Need to change room due to personal reasons');
    });

    test('should handle server errors', async () => {
      mockReq.body = {
        reason: 'Test reason',
      };

      // Mock RoomChangeRequest.save to throw error
      const originalSave = RoomChangeRequest.prototype.save;
      RoomChangeRequest.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      await submitRoomChangeRequest(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Server error.',
        error: 'Database error',
      });

      RoomChangeRequest.prototype.save = originalSave;
    });
  });

  describe('getAllRoomChangeRequests', () => {
    test('should return empty array when no requests exist', async () => {
      await getAllRoomChangeRequests(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      const requests = mockRes.json.mock.calls[0][0];
      expect(requests).toEqual([]);
    });

    test('should handle errors when fetching requests', async () => {
      // Mock RoomChangeRequest.find to throw error
      const originalFind = RoomChangeRequest.find;
      RoomChangeRequest.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockRejectedValue(new Error('Database error')),
        }),
      });

      await getAllRoomChangeRequests(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Server error',
        error: 'Database error',
      });

      RoomChangeRequest.find = originalFind;
    });
  });

  describe('updateRoomChangeStatus', () => {
    test('should update room change request status to Rejected', async () => {
      const request = await RoomChangeRequest.create({
        userId: testUser._id,
        reason: 'Test reason',
        status: 'Pending',
      });

      mockReq.params.requestId = request._id;
      mockReq.body = { status: 'Rejected' };

      await updateRoomChangeStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Status updated successfully',
      });

      const updatedRequest = await RoomChangeRequest.findById(request._id);
      expect(updatedRequest.status).toBe('Rejected');
    });

    test('should return 404 if request not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      mockReq.params.requestId = nonExistentId;
      mockReq.body = { status: 'Approved' };

      await updateRoomChangeStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Request not found',
      });
    });

    test('should return 404 if hostel application not found when approving', async () => {
      const request = await RoomChangeRequest.create({
        userId: testUser._id,
        reason: 'Test reason',
        status: 'Pending',
      });

      mockReq.params.requestId = request._id;
      mockReq.body = { status: 'Approved' };

      await updateRoomChangeStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Hostel application not found',
      });
    });

    test('should handle errors during status update', async () => {
      const request = await RoomChangeRequest.create({
        userId: testUser._id,
        reason: 'Test reason',
        status: 'Pending',
      });

      mockReq.params.requestId = request._id;
      mockReq.body = { status: 'Approved' };

      // Mock RoomChangeRequest.findById to throw error
      const originalFindById = RoomChangeRequest.findById;
      RoomChangeRequest.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      await updateRoomChangeStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Server Error',
        error: 'Database error',
      });

      RoomChangeRequest.findById = originalFindById;
    });
  });
});


const mongoose = require('mongoose');
const { getAdminStats } = require('../../../controllers/adminStatsController');
const HostelApplication = require('../../../models/HostelApplication');
const RoomChangeRequest = require('../../../models/RoomChangeRequest');
const Complaint = require('../../../models/Complaint');
const Room = require('../../../models/Room');
const User = require('../../../models/User');

describe('AdminStats Controller', () => {
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

    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(async () => {
    await HostelApplication.deleteMany({});
    await RoomChangeRequest.deleteMany({});
    await Complaint.deleteMany({});
    await Room.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should return zero counts when no data exists', async () => {
    await getAdminStats(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    const stats = mockRes.json.mock.calls[0][0];
    expect(stats.pendingApplications).toBe(0);
    expect(stats.pendingRoomChangeRequests).toBe(0);
    expect(stats.unresolvedComplaints).toBe(0);
    expect(stats.totalAllocatedRooms).toBe(0);
  });
});


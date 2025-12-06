const mongoose = require('mongoose');
const { submitComplaint, getAllComplaints, resolveComplaint, getMyComplaints } = require('../../../controllers/complaintController');
const Complaint = require('../../../models/Complaint');
const User = require('../../../models/User');

describe('Complaint Controller', () => {
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
      user: { _id: testUser._id },
      body: {},
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(async () => {
    await Complaint.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('submitComplaint', () => {
    test('should submit complaint successfully', async () => {
      mockReq.body = {
        rollNumber: '2024CS001',
        course: 'Computer Science',
        message: 'Test complaint message',
      };

      await submitComplaint(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Complaint submitted successfully.' });

      const complaint = await Complaint.findOne({ userId: testUser._id });
      expect(complaint).toBeDefined();
      expect(complaint.rollNumber).toBe('2024CS001');
      expect(complaint.message).toBe('Test complaint message');
    });
  });

  describe('getAllComplaints', () => {
    test('should get all complaints', async () => {
      await Complaint.create({
        userId: testUser._id,
        rollNumber: '2024CS001',
        course: 'Computer Science',
        message: 'Test complaint 1',
      });

      await Complaint.create({
        userId: testUser._id,
        rollNumber: '2024CS002',
        course: 'Mathematics',
        message: 'Test complaint 2',
      });

      await getAllComplaints(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalled();
      const complaints = mockRes.json.mock.calls[0][0];
      expect(complaints.length).toBe(2);
    });
  });

  describe('resolveComplaint', () => {
    test('should resolve complaint successfully', async () => {
      const complaint = await Complaint.create({
        userId: testUser._id,
        rollNumber: '2024CS001',
        course: 'Computer Science',
        message: 'Test complaint',
      });

      mockReq.params.id = complaint._id;

      await resolveComplaint(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalled();

      const updatedComplaint = await Complaint.findById(complaint._id);
      expect(updatedComplaint.status).toBe('Resolved');
    });
  });

  describe('getMyComplaints', () => {
    test('should get complaints for logged-in user', async () => {
      await Complaint.create({
        userId: testUser._id,
        rollNumber: '2024CS001',
        course: 'Computer Science',
        message: 'My complaint',
      });

      await getMyComplaints(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalled();
      const complaints = mockRes.json.mock.calls[0][0];
      expect(complaints.length).toBe(1);
      expect(complaints[0].message).toBe('My complaint');
    });
  });
});


const mongoose = require('mongoose');
const Complaint = require('../../../models/Complaint');
const User = require('../../../models/User');

describe('Complaint Model', () => {
  let testUser;

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
  });

  afterEach(async () => {
    await Complaint.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should create a complaint with valid data', async () => {
    const complaintData = {
      userId: testUser._id,
      rollNumber: '2024CS001',
      course: 'Computer Science',
      message: 'Test complaint message',
    };

    const complaint = await Complaint.create(complaintData);
    expect(complaint.userId.toString()).toBe(testUser._id.toString());
    expect(complaint.rollNumber).toBe(complaintData.rollNumber);
    expect(complaint.course).toBe(complaintData.course);
    expect(complaint.message).toBe(complaintData.message);
    expect(complaint.status).toBe('Pending');
  });

  test('should set default status to Pending', async () => {
    const complaintData = {
      userId: testUser._id,
      rollNumber: '2024CS001',
      course: 'Computer Science',
      message: 'Test complaint message',
    };

    const complaint = await Complaint.create(complaintData);
    expect(complaint.status).toBe('Pending');
  });

  test('should require userId field', async () => {
    const complaintData = {
      rollNumber: '2024CS001',
      course: 'Computer Science',
      message: 'Test complaint message',
    };

    await expect(Complaint.create(complaintData)).rejects.toThrow();
  });

  test('should require rollNumber field', async () => {
    const complaintData = {
      userId: testUser._id,
      course: 'Computer Science',
      message: 'Test complaint message',
    };

    await expect(Complaint.create(complaintData)).rejects.toThrow();
  });

  test('should require course field', async () => {
    const complaintData = {
      userId: testUser._id,
      rollNumber: '2024CS001',
      message: 'Test complaint message',
    };

    await expect(Complaint.create(complaintData)).rejects.toThrow();
  });

  test('should require message field', async () => {
    const complaintData = {
      userId: testUser._id,
      rollNumber: '2024CS001',
      course: 'Computer Science',
    };

    await expect(Complaint.create(complaintData)).rejects.toThrow();
  });

  test('should only allow Pending or Resolved status', async () => {
    const complaintData = {
      userId: testUser._id,
      rollNumber: '2024CS001',
      course: 'Computer Science',
      message: 'Test complaint message',
      status: 'Invalid',
    };

    await expect(Complaint.create(complaintData)).rejects.toThrow();
  });

  test('should add timestamps automatically', async () => {
    const complaintData = {
      userId: testUser._id,
      rollNumber: '2024CS001',
      course: 'Computer Science',
      message: 'Test complaint message',
    };

    const complaint = await Complaint.create(complaintData);
    expect(complaint.createdAt).toBeDefined();
    expect(complaint.updatedAt).toBeDefined();
  });
});


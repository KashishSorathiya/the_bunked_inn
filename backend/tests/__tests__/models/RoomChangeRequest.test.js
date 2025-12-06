const mongoose = require('mongoose');
const RoomChangeRequest = require('../../../models/RoomChangeRequest');
const User = require('../../../models/User');

describe('RoomChangeRequest Model', () => {
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
    await RoomChangeRequest.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should create a room change request with valid data', async () => {
    const requestData = {
      userId: testUser._id,
      reason: 'Need to change room due to personal reasons',
    };

    const request = await RoomChangeRequest.create(requestData);
    expect(request.userId.toString()).toBe(testUser._id.toString());
    expect(request.reason).toBe(requestData.reason);
    expect(request.status).toBe('Pending');
  });

  test('should set default status to Pending', async () => {
    const requestData = {
      userId: testUser._id,
      reason: 'Test reason',
    };

    const request = await RoomChangeRequest.create(requestData);
    expect(request.status).toBe('Pending');
  });

  test('should require userId field', async () => {
    const requestData = {
      reason: 'Test reason',
    };

    await expect(RoomChangeRequest.create(requestData)).rejects.toThrow();
  });

  test('should require reason field', async () => {
    const requestData = {
      userId: testUser._id,
    };

    await expect(RoomChangeRequest.create(requestData)).rejects.toThrow();
  });

  test('should add submittedAt timestamp automatically', async () => {
    const requestData = {
      userId: testUser._id,
      reason: 'Test reason',
    };

    const request = await RoomChangeRequest.create(requestData);
    expect(request.submittedAt).toBeDefined();
    expect(request.submittedAt).toBeInstanceOf(Date);
  });
});


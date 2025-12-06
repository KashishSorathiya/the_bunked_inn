const mongoose = require('mongoose');
const HostelApplication = require('../../../models/HostelApplication');
const User = require('../../../models/User');

describe('HostelApplication Model', () => {
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
    await HostelApplication.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should create a hostel application with valid data', async () => {
    const applicationData = {
      userId: testUser._id,
      rollNumber: '2024CS001',
      course: 'Computer Science',
      gender: 'male',
    };

    const application = await HostelApplication.create(applicationData);
    expect(application.userId.toString()).toBe(testUser._id.toString());
    expect(application.rollNumber).toBe(applicationData.rollNumber);
    expect(application.course).toBe(applicationData.course);
    expect(application.gender).toBe(applicationData.gender);
    expect(application.applicationStatus).toBe('Pending');
    expect(application.isApplicationApproved).toBe(false);
  });

  test('should set default applicationStatus to Pending', async () => {
    const applicationData = {
      userId: testUser._id,
      rollNumber: '2024CS001',
      course: 'Computer Science',
      gender: 'male',
    };

    const application = await HostelApplication.create(applicationData);
    expect(application.applicationStatus).toBe('Pending');
  });

  test('should set default isApplicationApproved to false', async () => {
    const applicationData = {
      userId: testUser._id,
      rollNumber: '2024CS001',
      course: 'Computer Science',
      gender: 'male',
    };

    const application = await HostelApplication.create(applicationData);
    expect(application.isApplicationApproved).toBe(false);
  });

  test('should require userId field', async () => {
    const applicationData = {
      rollNumber: '2024CS001',
      course: 'Computer Science',
      gender: 'male',
    };

    await expect(HostelApplication.create(applicationData)).rejects.toThrow();
  });

  test('should require rollNumber field', async () => {
    const applicationData = {
      userId: testUser._id,
      course: 'Computer Science',
      gender: 'male',
    };

    await expect(HostelApplication.create(applicationData)).rejects.toThrow();
  });

  test('should require course field', async () => {
    const applicationData = {
      userId: testUser._id,
      rollNumber: '2024CS001',
      gender: 'male',
    };

    await expect(HostelApplication.create(applicationData)).rejects.toThrow();
  });

  test('should require gender field', async () => {
    const applicationData = {
      userId: testUser._id,
      rollNumber: '2024CS001',
      course: 'Computer Science',
    };

    await expect(HostelApplication.create(applicationData)).rejects.toThrow();
  });

  test('should only allow male, female, or other for gender', async () => {
    const applicationData = {
      userId: testUser._id,
      rollNumber: '2024CS001',
      course: 'Computer Science',
      gender: 'invalid',
    };

    await expect(HostelApplication.create(applicationData)).rejects.toThrow();
  });

  test('should only allow Pending, Approved, or Rejected for applicationStatus', async () => {
    const applicationData = {
      userId: testUser._id,
      rollNumber: '2024CS001',
      course: 'Computer Science',
      gender: 'male',
      applicationStatus: 'Invalid',
    };

    await expect(HostelApplication.create(applicationData)).rejects.toThrow();
  });
});


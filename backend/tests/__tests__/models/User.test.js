const mongoose = require('mongoose');
const User = require('../../../models/User');

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should create a user with valid data', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@dau.ac.in',
      password: 'hashedpassword123',
      role: 'student',
    };

    const user = await User.create(userData);
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.role).toBe('student');
    expect(user.applied).toBe(false);
  });

  test('should set default role to student', async () => {
    const userData = {
      name: 'Jane Doe',
      email: 'jane@dau.ac.in',
      password: 'hashedpassword123',
    };

    const user = await User.create(userData);
    expect(user.role).toBe('student');
  });

  test('should set default applied to false', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@dau.ac.in',
      password: 'hashedpassword123',
    };

    const user = await User.create(userData);
    expect(user.applied).toBe(false);
  });

  test('should require name field', async () => {
    const userData = {
      email: 'test@dau.ac.in',
      password: 'hashedpassword123',
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  test('should require email field', async () => {
    const userData = {
      name: 'Test User',
      password: 'hashedpassword123',
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  test('should require password field', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@dau.ac.in',
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  test('should enforce unique email', async () => {
    const uniqueEmail = `test${Date.now()}${Math.random()}@dau.ac.in`;
    const userData = {
      name: 'Test User',
      email: uniqueEmail,
      password: 'hashedpassword123',
    };

    await User.create(userData);
    await expect(User.create(userData)).rejects.toThrow();
  });

  test('should only allow student or admin role', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@dau.ac.in',
      password: 'hashedpassword123',
      role: 'invalid',
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  test('should add timestamps automatically', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@dau.ac.in',
      password: 'hashedpassword123',
    };

    const user = await User.create(userData);
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });
});


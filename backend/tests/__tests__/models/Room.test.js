const mongoose = require('mongoose');
const Room = require('../../../models/Room');
const User = require('../../../models/User');

describe('Room Model', () => {
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
    await Room.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should create a room with valid data', async () => {
    const roomData = {
      roomNumber: 'B-101',
      gender: 'male',
      occupants: [],
    };

    const room = await Room.create(roomData);
    expect(room.roomNumber).toBe(roomData.roomNumber);
    expect(room.gender).toBe(roomData.gender);
    expect(room.occupants).toEqual([]);
  });

  test('should set default occupants to empty array', async () => {
    const roomData = {
      roomNumber: 'B-102',
      gender: 'male',
    };

    const room = await Room.create(roomData);
    expect(room.occupants).toEqual([]);
  });

  test('should require roomNumber field', async () => {
    const roomData = {
      gender: 'male',
    };

    await expect(Room.create(roomData)).rejects.toThrow();
  });

  test('should require gender field', async () => {
    const roomData = {
      roomNumber: 'B-103',
    };

    await expect(Room.create(roomData)).rejects.toThrow();
  });

  test('should only allow male or female for gender', async () => {
    const roomData = {
      roomNumber: 'B-104',
      gender: 'invalid',
    };

    await expect(Room.create(roomData)).rejects.toThrow();
  });

  test('should enforce unique roomNumber', async () => {
    const roomData = {
      roomNumber: 'B-105',
      gender: 'male',
    };

    await Room.create(roomData);
    await expect(Room.create(roomData)).rejects.toThrow();
  });

  test('should store occupants with userId and course', async () => {
    const roomData = {
      roomNumber: 'B-106',
      gender: 'male',
      occupants: [
        { userId: testUser._id, course: 'Computer Science' },
      ],
    };

    const room = await Room.create(roomData);
    expect(room.occupants.length).toBe(1);
    expect(room.occupants[0].userId.toString()).toBe(testUser._id.toString());
    expect(room.occupants[0].course).toBe('Computer Science');
  });

  test('should have virtual capacity of 2', async () => {
    const roomData = {
      roomNumber: 'B-107',
      gender: 'male',
    };

    const room = await Room.create(roomData);
    expect(room.capacity).toBe(2);
  });

  test('should correctly identify if room is full', async () => {
    const roomData = {
      roomNumber: 'B-108',
      gender: 'male',
      occupants: [
        { userId: testUser._id, course: 'Computer Science' },
        { userId: new mongoose.Types.ObjectId(), course: 'Mathematics' },
      ],
    };

    const room = await Room.create(roomData);
    expect(room.isFull).toBe(true);
  });

  test('should correctly identify if room is not full', async () => {
    const roomData = {
      roomNumber: 'B-109',
      gender: 'male',
      occupants: [
        { userId: testUser._id, course: 'Computer Science' },
      ],
    };

    const room = await Room.create(roomData);
    expect(room.isFull).toBe(false);
  });
});


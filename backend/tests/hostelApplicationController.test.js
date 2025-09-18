// backend/tests/hostelApplicationController.test.js
const mockSave = jest.fn();

jest.mock('../models/HostelApplication', () => {
  // define everything *inside* the callback
  const HostelApplicationMock = jest.fn().mockImplementation(function (data) {
    Object.assign(this, data);
    this.save = mockSave;
  });
  HostelApplicationMock.findOne = jest.fn();
  // export it
  return HostelApplicationMock;
});

jest.mock('../models/User', () => ({
  findByIdAndUpdate: jest.fn(),
}));

const { submitHostelApplication } = require('../controllers/hostelApplicationController');
const HostelApplication = require('../models/HostelApplication');
const User = require('../models/User');

describe('submitHostelApplication controller (unit)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 if user already applied', async () => {
    HostelApplication.findOne.mockResolvedValue({ _id: 'existingApp' });

    const req = {
      body: { rollNumber: '123', course: 'CS', gender: 'male' },
      user: { id: 'user1' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await submitHostelApplication(req, res);

    expect(HostelApplication.findOne).toHaveBeenCalledWith({ userId: 'user1' });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'You have already applied for hostel.' });
  });

  it('creates new application and updates user if not applied', async () => {
    HostelApplication.findOne.mockResolvedValue(null);
    mockSave.mockResolvedValue(true);
    User.findByIdAndUpdate.mockResolvedValue(true);

    const req = {
      body: { rollNumber: '456', course: 'EC', gender: 'female' },
      user: { id: 'user2' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await submitHostelApplication(req, res);

    expect(HostelApplication.findOne).toHaveBeenCalledWith({ userId: 'user2' });
    expect(HostelApplication).toHaveBeenCalledWith({
      userId: 'user2',
      rollNumber: '456',
      course: 'EC',
      gender: 'female',
    });
    expect(mockSave).toHaveBeenCalled();
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith('user2', { applied: true });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Hostel application submitted successfully.' });
  });
});

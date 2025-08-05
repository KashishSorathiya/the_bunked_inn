import mongoose from 'mongoose';

const roomChangeRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  currentRoom: {
    type: String,
    default: '',
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  }
});

const RoomChangeRequest = mongoose.model('RoomChangeRequest', roomChangeRequestSchema);

export default RoomChangeRequest;

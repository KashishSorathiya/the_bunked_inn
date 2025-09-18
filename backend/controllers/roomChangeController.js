const RoomChangeRequest = require('../models/RoomChangeRequest');
const User = require('../models/User');
const HostelApplication = require('../models/HostelApplication');
const Room = require("../models/Room");

// Student submits room change request
const submitRoomChangeRequest = async (req, res) => {
  try {
    const { reason, currentRoom } = req.body;
    const userId = req.user.id;

    const newRequest = new RoomChangeRequest({
      userId,
      reason,
      currentRoom,
    });

    await newRequest.save();
    res.status(201).json({ message: 'Room change request submitted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// Admin fetches all requests
const getAllRoomChangeRequests = async (req, res) => {
  try {
    const requests = await RoomChangeRequest.find()
      .populate("userId", "name email")
      .sort({ requestedAt: -1 });

    const enrichedRequests = await Promise.all(
      requests.map(async (req) => {
        const hostelApp = await HostelApplication.findOne({ userId: req.userId?._id });

        return {
          _id: req._id,
          name: req.userId?.name || "N/A",
          email: req.userId?.email || "N/A",
          rollNumber: hostelApp?.rollNumber || "N/A",
          course: hostelApp?.course || "N/A",
          reason: req.reason,
          status: req.status,
          requestedAt: req.requestedAt,
        };
      })
    );

    return res.status(200).json(enrichedRequests);
  } catch (err) {
    console.error("❌ Error fetching room change requests:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin approves/rejects request
const updateRoomChangeStatus = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  try {
    const request = await RoomChangeRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;
    await request.save();

    if (status === "Approved") {
      const application = await HostelApplication.findOne({ userId: request.userId });
      if (!application) return res.status(404).json({ message: "Hostel application not found" });

      const gender = application.gender;
      const course = application.course;
      const userId = application.userId;

      // Step 1: Try to find room with same gender and same course
      let room = await Room.findOne({
        gender,
        occupants: { $size: 1 },
        "occupants.course": course,
      });

      // Step 2: If not found, try any room with same gender and 1 occupant
      if (!room) {
        room = await Room.findOne({
          gender,
          occupants: { $size: 1 },
        });
      }

      // Step 3: If still not found, create new room
      if (!room) {
        const prefix = gender === "male" ? "B" : "G";
        const allRooms = await Room.find({ gender });

        //SAFELY extract room numbers (ignore invalid ones)
        const existingNumbers = allRooms
          .map(r => {
            const parts = r.roomNumber?.split("-");
            const num = parts && parts.length === 2 ? parseInt(parts[1]) : NaN;
            return isNaN(num) ? null : num;
          })
          .filter(n => n !== null);

        const nextNumber = existingNumbers.length > 0
          ? Math.max(...existingNumbers) + 1
          : 101;

        const roomNumber = `${prefix}-${nextNumber}`;

        room = new Room({
          roomNumber,
          gender,
          occupants: [],
        });
      }

      // Step 4: Add student to room
      room.occupants.push({ userId, course });
      await room.save();

      // Step 5: Update student’s application with new room
      application.roomNumber = room.roomNumber;
      await application.save();
    }

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating room change request:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


module.exports = {
  submitRoomChangeRequest,
  getAllRoomChangeRequests,
  updateRoomChangeStatus,
};

const HostelApplication = require("../models/HostelApplication");
const RoomChangeRequest = require("../models/RoomChangeRequest");
const Complaint = require("../models/Complaint");
const Room = require("../models/Room");

const getAdminStats = async (req, res) => {
  try {
    const pendingApplications = await HostelApplication.countDocuments({
      applicationStatus: "Pending",
    });

    const pendingRoomChangeRequests = await RoomChangeRequest.countDocuments({
      status: "Pending",
    });

    const pendingComplaints = await Complaint.countDocuments({
      status: "Pending", // ✅ FIXED: Match with actual complaint status
    });

    const rooms = await Room.find({});
    const totalAllocatedRooms = rooms.filter(room => room.occupants.length > 0).length;

    res.status(200).json({
      pendingApplications,
      pendingRoomChangeRequests,
      unresolvedComplaints: pendingComplaints, // ✅ Renamed key, but value is now correct
      totalAllocatedRooms,
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ message: "Failed to fetch dashboard stats." });
  }
};

module.exports = { getAdminStats };

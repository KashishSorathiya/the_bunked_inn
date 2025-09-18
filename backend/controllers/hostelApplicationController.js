const HostelApplication = require("../models/HostelApplication");
const Room = require("../models/Room");
const User = require("../models/User");

const submitHostelApplication = async (req, res) => {
  try {
    const { rollNumber, course, gender } = req.body;
    const userId = req.user.id;

    //console.log("Received hostel application:", { userId, rollNumber, course, gender });

    const existing = await HostelApplication.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: "You have already applied for hostel." });
    }

    const newApplication = new HostelApplication({
      userId,
      rollNumber,
      course,
      gender, 
    });

    await newApplication.save();
    await User.findByIdAndUpdate(userId, { applied: true });
    res.status(201).json({ message: "Hostel application submitted successfully." });
  } catch (err) {
    console.error("❌ Hostel Application Error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};


// Admin fetches all hostel applications
const getAllHostelApplications = async (req, res) => {
  try {
    const applications = await HostelApplication.find()
      .populate('userId', 'name email gender')
      .sort({ submittedAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications", error: err.message });
  }
};

// Admin updates status

const updateHostelApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApplicationApproved } = req.body;

    const application = await HostelApplication.findById(id); 

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (!isApplicationApproved) {
      application.applicationStatus = "Rejected";
      application.isApplicationApproved = false;
      await application.save();
      return res.status(200).json({ message: "Application rejected successfully." });
    }

    const gender = application.gender;
    const course = application.course;
    const userId = application.userId;

    
    //Find existing room with same gender & course
    let room = await Room.findOne({
      gender,
      $expr: { $lt: [{ $size: "$occupants" }, 2] },
      occupants: { $elemMatch: { course } }
    });

    // If not found, try with same gender only
    if (!room) {
      room = await Room.findOne({
        gender,
        $expr: { $lt: [{ $size: "$occupants" }, 2] }
      });
    }

    //If still not found, create new room
    if (!room) {
      const prefix = gender === "female" ? "G" : "B";
      const allRooms = await Room.find({ gender });

      let nextNumber = 101;

      if (allRooms.length > 0) {
        const existingNumbers = allRooms
          .map(r => {
            const parts = r.roomNumber.split("-");
            const number = parseInt(parts[1]);
            return isNaN(number) ? 0 : number;
          })
          .filter(n => n > 0);

        nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 101;
      }

      const formattedRoomNumber = `${prefix}-${nextNumber}`;

      room = new Room({
        roomNumber: formattedRoomNumber,
        gender,
        occupants: []
      });

      await room.save();
    }

    //Add user to room
    room.occupants.push({ userId, course });
    await room.save();

    //Update application
    application.roomNumber = room.roomNumber;
    application.applicationStatus = "Approved";
    application.isApplicationApproved = true;
    await application.save();

    //Update user
    await User.findByIdAndUpdate(userId, {
      applied: true,
      roomNumber: room.roomNumber
    });

    res.status(200).json({
      message: "Application approved and room assigned.",
      roomNumber: room.roomNumber
    });

  } catch (err) {
    console.error("Room allocation error:", err);
    res.status(500).json({ message: "Failed to process the application. Please try again." });
  }
};

module.exports = {
  submitHostelApplication,
  getAllHostelApplications,
  updateHostelApplication,
};

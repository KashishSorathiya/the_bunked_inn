const Complaint = require("../models/Complaint");

const submitComplaint = async (req, res) => {
  try {
    
    const { rollNumber, course, message } = req.body;
    const userId = req.user._id;

    

    const complaint = new Complaint({
      userId,
      rollNumber,
      course,
      message,
    });

    await complaint.save();

   
    res.status(201).json({ message: "Complaint submitted successfully." });
  } catch (err) {
    console.error("❌ Error submitting complaint:", err);
    res.status(500).json({ message: "Submission failed", error: err.message });
  }
};



// Admin gets all complaints
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch complaints", error: err.message });
  }
};

// Admin resolves complaint
const resolveComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status: "Resolved" },
      { new: true }
    );

    res.status(200).json({ message: "Complaint marked as resolved", complaint });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
};

// Get complaints for the logged-in student
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your complaints", error: err.message });
  }
};


module.exports = {
  submitComplaint,
  getAllComplaints,
  resolveComplaint,
  getMyComplaints,
};

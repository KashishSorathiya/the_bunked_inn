const { submitComplaint, getAllComplaints, resolveComplaint, getMyComplaints } = require("../controllers/complaintController");
const Complaint = require("../models/Complaint");
const User = require("../models/User");

jest.mock("../models/Complaint");
jest.mock("../models/User");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Complaint Controller Tests", () => {

  test("submitComplaint - creates complaint successfully", async () => {
    const req = {
      user: { _id: "user123" },
      body: { rollNumber: "21BCS001", course: "CSE", message: "Fan not working" },
    };
    Complaint.prototype.save = jest.fn().mockResolvedValue(true);

    const res = mockResponse();

    await submitComplaint(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Complaint submitted successfully." });
  });


  test("getAllComplaints - returns complaints list", async () => {
    const req = {};
    const res = mockResponse();

    Complaint.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([{ message: "Test complaint" }]),
    });

    await getAllComplaints(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });


  test("resolveComplaint - updates status", async () => {
    const req = { params: { id: "c123" } };
    const res = mockResponse();

    Complaint.findByIdAndUpdate = jest.fn().mockResolvedValue({ status: "Resolved" });

    await resolveComplaint(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });


  test("getMyComplaints - returns user complaints", async () => {
    const req = { user: { _id: "u1" } };
    const res = mockResponse();

    Complaint.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([{ message: "AC issue" }]),
    });

    await getMyComplaints(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

});

const { submitRoomChangeRequest, getAllRoomChangeRequests, updateRoomChangeStatus } = require("../controllers/roomChangeController");
const RoomChangeRequest = require("../models/RoomChangeRequest");
const HostelApplication = require("../models/HostelApplication");
const Room = require("../models/Room");

jest.mock("../models/RoomChangeRequest");
jest.mock("../models/HostelApplication");
jest.mock("../models/Room");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Room Change Controller Tests", () => {

  test("submitRoomChangeRequest - success", async () => {
    const req = { user: { id: "u123" }, body: { reason: "Noise", currentRoom: "B-102" } };

    RoomChangeRequest.prototype.save = jest.fn().mockResolvedValue(true);

    const res = mockResponse();
    await submitRoomChangeRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("getAllRoomChangeRequests - returns list", async () => {
    const req = {};
    const res = mockResponse();

    RoomChangeRequest.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([]),
    });

    HostelApplication.findOne = jest.fn().mockResolvedValue(null);

    await getAllRoomChangeRequests(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("updateRoomChangeStatus - request not found", async () => {
    const req = { params: { requestId: "abc" }, body: { status: "Approved" } };
    const res = mockResponse();

    RoomChangeRequest.findById = jest.fn().mockResolvedValue(null);

    await updateRoomChangeStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

});

const jwt = require("jsonwebtoken");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");
const User = require("../models/User");

// Mock User model
jest.mock("../models/User");

describe("Authentication Middleware", () => {

    it("should return 401 if no token is provided", async () => {
        const req = { headers: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        await authenticateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized: No token provided" });
    });

    it("should return 401 if token is invalid", async () => {
        const req = { headers: { authorization: "Bearer invalidtoken" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        jwt.verify = jest.fn(() => { throw new Error("Invalid token"); });

        await authenticateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized: Invalid token" });
    });

    it("should call next() if token is valid", async () => {
        const user = { _id: "123", name: "Test User", role: "student" };
        const req = { headers: { authorization: "Bearer validtoken" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        jwt.verify = jest.fn(() => ({ id: "123" }));

        User.findById.mockReturnValue({
            select: jest.fn().mockResolvedValue(user)
        });

        await authenticateUser(req, res, next);

        expect(req.user).toEqual(user);
        expect(next).toHaveBeenCalled();
    });

}); // ✅ Yaha closing bracket add kiya hai

// ✅ Authorization Tests
describe("Authorization Middleware", () => {

    it("should allow user if role matches", () => {
        const req = { user: { role: "admin" } };
        const res = {};
        const next = jest.fn();

        authorizeRoles("admin")(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it("should block user if role does not match", () => {
        const req = { user: { role: "student" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        authorizeRoles("admin")(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Forbidden: Access denied" });
    });

});

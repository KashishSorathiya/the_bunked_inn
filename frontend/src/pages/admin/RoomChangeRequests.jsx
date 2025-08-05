import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RoomChangeRequests.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RoomChangeRequests = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/room-change/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to load room change requests", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/room-change/update/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(`Request ${status}`);
      fetchRequests();
    } catch (err) {
      console.error("❌ Failed to update request status", err.response?.data || err.message);
      toast.error("Failed to update request.");
    }
  };

  return (
    <div className="room-change-requests-container">
      <h2 className="title">Room Change Requests</h2>
      <div className="table-wrapper">
        {requests.length === 0 ? (
          <p>No room change requests found.</p>
        ) : (
          <table className="requests-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No</th>
                <th>Course</th>
                <th>Email</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>{req.name}</td>
                  <td>{req.rollNumber}</td>
                  <td>{req.course}</td>
                  <td>{req.email}</td>
                  <td>{req.reason}</td>
                  <td>
                    <span
                      className={`status ${
                        req.status === "Approved"
                          ? "approved"
                          : req.status === "Rejected"
                          ? "rejected"
                          : "pending"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td>
                    {req.status === "Pending" ? (
                      <>
                        <button
                          className="btn approve"
                          onClick={() => updateStatus(req._id, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn reject"
                          onClick={() => updateStatus(req._id, "Rejected")}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span style={{ fontWeight: "500", color: "#888" }}>
                        Already {req.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default RoomChangeRequests;

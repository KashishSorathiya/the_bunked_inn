import React, { useState, useEffect, useRef } from "react";
import "./RequestRoomChange.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RequestRoomChange = () => {
  const [reason, setReason] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");
  const hasFetched = useRef(false); // ✅ Prevents duplicate fetches

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setCurrentRoom(res.data.roomNumber || "");
      } catch (err) {
        console.error("Error fetching user info:", err.response?.data || err.message);
        toast.error("❌ Failed to load user information.");
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
    `${process.env.REACT_APP_API_URL}/api/room-change/submit`,
        { reason, currentRoom },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("✅ Room change request submitted!");
      setReason("");
    } catch (err) {
      console.error("Submit error:", err);
      if (err.response?.data?.message) {
        toast.error("❌ " + err.response.data.message);
      } else {
        toast.error("❌ Failed to submit request.");
      }
    }
  };

  return (
    <div className="room-change-form">
      <h2>🔁 Request Room Change</h2>
      <p className="subtext">Provide a reason for your room change request</p>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write your reason here..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
        <button type="submit">Submit Request</button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default RequestRoomChange;

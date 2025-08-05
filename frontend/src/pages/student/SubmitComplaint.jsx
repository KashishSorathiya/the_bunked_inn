import React, { useState } from "react";
import axios from "axios";
import "./SubmitComplaint.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubmitComplaint = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [course, setCourse] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/complaints/submit",
        { rollNumber, course, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("📦 Response from backend:", res.data);
      toast.success(res.data.message); // ✅ Toast on success

      setRollNumber("");
      setCourse("");
      setMessage("");
    } catch (err) {
      console.error("❌ Axios error:", err.response?.data || err.message);
      toast.error("Failed to submit complaint"); // ❌ Toast on failure
    }
  };

  return (
    <div className="complaint-wrapper">
      <div className="complaint-card">
        <h2>📋 Submit Complaint</h2>
        <p>Fill out this form to submit your complaint.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Course/Department"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          />
          <textarea
            placeholder="Describe your issue"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          <button type="submit">Submit Complaint</button>
        </form>
      </div>

      {/* ✅ Toast notification container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SubmitComplaint;

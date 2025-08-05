import React from "react";
import "./StudentHome.css";

const StudentHome = ({ studentData, setSelectedSection }) => {
  const { name, hostelStatus } = studentData;

  return (
    <div className="student-home">
      <h2>Welcome, {name} 👋</h2>

      <div className="status-card">
        <h3>🏠 Hostel Status</h3>
        <p>
          Applied For Hostel:{" "}
          {hostelStatus?.applied ? (
            <span style={{ color: "green" }}>✅ Yes</span>
          ) : (
            <span style={{ color: "red" }}>❌ No</span>
          )}
        </p>
        <p>
          Hostel Approved:{" "}
          {hostelStatus?.verified ? (
            <span style={{ color: "green" }}>✅ Yes</span>
          ) : (
            <span style={{ color: "red" }}>❌ No</span>
          )}
        </p>
        <p>
          Room Number:{" "}
          {hostelStatus?.roomNumber ? hostelStatus.roomNumber : "Not Allocated"}
        </p>
      </div>

      <div className="quick-actions">
        <h3>⚡ Quick Actions</h3>
        <button onClick={() => setSelectedSection("apply-hostel")}>
          Apply for Hostel
        </button>
        <button onClick={() => setSelectedSection("room-change")}>
          Request Room Change
        </button>
        <button onClick={() => setSelectedSection("view-complaints")}>
          View Complaints
        </button>
      </div>
    </div>
  );
};

export default StudentHome;

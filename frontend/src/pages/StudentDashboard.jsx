import React, { useState, useEffect } from "react";
import "./StudentDashboard.css";
import StudentHome from "./student/StudentHome";
import ApplyHostel from "./student/ApplyHostel";
import RequestRoomChange from "./student/RequestRoomChange";
import SubmitComplaint from "./student/SubmitComplaint";
import ViewComplaints from "./student/ViewComplaints";

const StudentDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("home");
  const [studentData, setStudentData] = useState({
    name: "",
    hostelStatus: {
      applied: false,
      verified: false,
      roomNumber: null,
    },
  });

  useEffect(() => {
    setSelectedSection("home");

    const fetchStudentData = async () => {
      const token = localStorage.getItem("token");

      // Load student name from localStorage
      const stored = localStorage.getItem("student");
      if (stored) {
        const parsed = JSON.parse(stored);
        setStudentData((prev) => ({
          ...prev,
          name: parsed.name || "Student",
        }));
      }

      // Fetch hostel application info
      try {
        const res = await fetch("http://localhost:5000/api/hostel-application/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setStudentData((prev) => ({
            ...prev,
            hostelStatus: {
              applied: true,
              verified: data.applicationStatus === "Approved",
              roomNumber: data.roomNumber || "N/A",
            },
          }));
        } else {
          setStudentData((prev) => ({
            ...prev,
            hostelStatus: {
              applied: false,
              verified: false,
              roomNumber: null,
            },
          }));
        }
      } catch (err) {
        console.error("❌ Failed to fetch hostel application:", err.message);
      }
    };

    fetchStudentData();
  }, []);

  const renderSection = () => {
    switch (selectedSection) {
      case "apply-hostel":
        return <ApplyHostel />;
      case "room-change":
        return <RequestRoomChange />;
      case "submit-complaint":
        return <SubmitComplaint />;
      case "view-complaints":
        return <ViewComplaints />;
      default:
        return (
          <StudentHome
            studentData={studentData}
            setSelectedSection={setSelectedSection}
          />
        );
    }
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <h2>Student Panel</h2>
        <ul>
          <li onClick={() => setSelectedSection("home")}>🏠 Home</li>
          <li onClick={() => setSelectedSection("apply-hostel")}>
            🧾 Apply for Hostel
          </li>
          <li onClick={() => setSelectedSection("room-change")}>
            🔁 Request Room Change
          </li>
          <li onClick={() => setSelectedSection("submit-complaint")}>
            📋 Submit Complaint
          </li>
          <li onClick={() => setSelectedSection("view-complaints")}>
            📑 View Complaints
          </li>
          <li
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("student");
              window.location.href = "/";
            }}
          >
            🚪 Logout
          </li>
        </ul>
      </aside>

      <main className="dashboard-content">{renderSection()}</main>
    </div>
  );
};

export default StudentDashboard;

import React, { useState, useEffect } from "react";
import "./ManageComplaints.css";

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);

  // Fetch complaints from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/complaints", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();

        if (Array.isArray(data)) {
          // Sort by newest first
          const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setComplaints(sorted);
        } else {
          setComplaints([]);
        }
      } catch (err) {
        console.error("Error fetching complaints:", err);
      }
    };

    fetchComplaints();
  }, []);

  // Mark complaint as resolved
  const handleResolve = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/complaints/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        const updated = complaints.map((c) =>
          c._id === id ? { ...c, status: "Resolved" } : c
        );
        setComplaints(updated);
      }
    } catch (err) {
      console.error("Failed to update complaint status", err);
    }
  };

  return (
    <div className="admin-page">
      <h2 className="page-title">Manage Complaints</h2>
      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No</th>
              <th>Course</th>
              <th>Email</th>
              <th>Complaint</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>
                  No complaints submitted yet.
                </td>
              </tr>
            ) : (
              complaints.map((item) => (
                <tr key={item._id}>
                  <td>{item.userId?.name || "N/A"}</td>
                  <td>{item.rollNumber}</td>
                  <td>{item.course}</td>
                  <td>{item.userId?.email || "N/A"}</td>
                  <td>{item.message}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        item.status === "Resolved" ? "status-resolved" : "status-pending"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {item.status === "Pending" && (
                      <button className="resolve-btn" onClick={() => handleResolve(item._id)}>
                        Mark as Resolved
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageComplaints;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewComplaints.css";

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc"); // default: newest first

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/complaints/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setComplaints(res.data);
      } catch (err) {
        console.error("Failed to fetch complaints", err);
      }
    };

    fetchComplaints();
  }, []);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const sortedComplaints = [...complaints].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="view-complaints">
      <h2>📑 Your Complaints</h2>

      {complaints.length === 0 ? (
        <p>No complaints submitted yet.</p>
      ) : (
        <>
          <button className="sort-btn" onClick={toggleSortOrder}>
            Sort by Date: {sortOrder === "desc" ? "Newest First" : "Oldest First"}
          </button>

          <div className="complaint-table">
            <table>
              <thead>
                <tr>
                  <th>Complaint</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {sortedComplaints.map((c) => (
                  <tr key={c._id}>
                    <td>{c.message}</td>
                    <td>
                      <span
                        className={
                          c.status === "Resolved"
                            ? "status-badge status-resolved"
                            : "status-badge status-pending"
                        }
                      >
                        {c.status}
                      </span>
                    </td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewComplaints;

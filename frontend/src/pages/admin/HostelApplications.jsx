import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./HostelApplications.css";

const HostelApplications = () => {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/hostel-application", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching hostel applications:", err);
      toast.error("❌ Failed to fetch applications.");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAction = async (id, approve) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/hostel-application/${id}`,
        { isApplicationApproved: approve },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (approve && response.data.roomNumber) {
        toast.success(`Application approved! Room ${response.data.roomNumber} has been allocated.`);
      } else {
        toast.info("Application rejected.");
      }

      fetchApplications();
    } catch (err) {
      console.error("Error updating application:", err);
      toast.error("❌ Failed to process the application.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  return (
    <div className="hostel-applications-container">
      <h2 className="title">Hostel Applications</h2>
      <div className="table-wrapper">
        {applications.length === 0 ? (
          <p>No hostel applications submitted.</p>
        ) : (
          <table className="applications-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No</th>
                <th>Course</th>
                <th>Email</th>
                <th>Status</th>
                <th>Approved</th>
                <th>Room No</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>{app.userId?.name}</td>
                  <td>{app.rollNumber}</td>
                  <td>{app.course}</td>
                  <td>{app.userId?.email}</td>
                  <td>
                    <span className={getStatusStyle(app.applicationStatus)}>
                      {app.applicationStatus}
                    </span>
                  </td>
                  <td>{app.isApplicationApproved ? "Approved" : "Not Approved"}</td>
                  <td>{app.roomNumber || "Not Assigned"}</td>
                  <td>
                    {app.applicationStatus.toLowerCase() === "pending" ? (
                      <>
                        <button className="btn approve" onClick={() => handleAction(app._id, true)}>
                          Approve
                        </button>
                        <button className="btn reject" onClick={() => handleAction(app._id, false)}>
                          Reject
                        </button>
                      </>
                    ) : (
                      <span>{app.applicationStatus}</span>
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

export default HostelApplications;

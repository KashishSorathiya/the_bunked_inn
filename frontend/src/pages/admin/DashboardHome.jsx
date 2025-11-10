import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DashboardHome.css';
import { FaUsers, FaExchangeAlt, FaExclamationCircle, FaBed } from 'react-icons/fa';

const DashboardHome = ({ setActiveSection }) => {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard-home">
      <h2 className="status-title">Welcome, Admin 👨‍💼</h2>

      {!stats ? (
        <p>Loading stats...</p>
      ) : (
        <div className="status-card">
          <div className="status-section" onClick={() => setActiveSection("HostelApplications")}>
            <FaUsers className="status-icon" />
            <div>
              <p className="font-semibold">Hostel Applications</p>
              <p>{stats.pendingApplications} pending</p>
            </div>
          </div>

          <div className="status-section" onClick={() => setActiveSection("RoomChangeRequests")}>
            <FaExchangeAlt className="status-icon" />
            <div>
              <p className="font-semibold">Room Change Requests</p>
              <p>{stats.pendingRoomChangeRequests} new requests</p>
            </div>
          </div>

          <div className="status-section" onClick={() => setActiveSection("ManageComplaints")}>
            <FaExclamationCircle className="status-icon" />
            <div>
              <p className="font-semibold">Complaints</p>
              <p>{stats.unresolvedComplaints} unresolved</p>
            </div>
          </div>

          <div className="status-section" onClick={() => setActiveSection("AllocatedRooms")}>
            <FaBed className="status-icon" />
            <div>
              <p className="font-semibold">Allocated Rooms</p>
              <p>{stats.totalAllocatedRooms} rooms filled</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;

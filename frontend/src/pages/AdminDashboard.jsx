import React, { useState } from "react";
import { FaHome, FaBed, FaExchangeAlt, FaTasks, FaCheckCircle, FaSignOutAlt } from "react-icons/fa";
import DashboardHome from "./admin/DashboardHome";
import HostelApplications from "./admin/HostelApplications";
import RoomChangeRequests from "./admin/RoomChangeRequests";
import ManageComplaints from "./admin/ManageComplaints";
import AllocatedRooms from "./admin/AllocatedRooms";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("DashboardHome");

  const renderSection = () => {
    switch (activeSection) {
      case "DashboardHome":
  return <DashboardHome setActiveSection={setActiveSection} />;
      case "HostelApplications":
        return <HostelApplications />;
      case "RoomChangeRequests":
        return <RoomChangeRequests />;
      case "ManageComplaints":
        return <ManageComplaints />;
      case "AllocatedRooms":
        return <AllocatedRooms />;
      default:
        return <DashboardHome />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>🏫 Admin Panel</h2>
        <ul>
          <li onClick={() => setActiveSection("DashboardHome")}>
            <FaHome /> Dashboard
          </li>
          <li onClick={() => setActiveSection("HostelApplications")}>
            <FaBed /> Hostel Applications
          </li>
          <li onClick={() => setActiveSection("RoomChangeRequests")}>
            <FaExchangeAlt /> Room Change Requests
          </li>
          <li onClick={() => setActiveSection("ManageComplaints")}>
            <FaTasks /> Manage Complaints
          </li>
          <li onClick={() => setActiveSection("AllocatedRooms")}>
            <FaCheckCircle /> Allocated Rooms
          </li>
          <li onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </aside>
      <main className="main-content">{renderSection()}</main>
    </div>
  );
};

export default AdminDashboard;

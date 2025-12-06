import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllocatedRooms.css';

const AllocatedRooms = () => {
  const [allocatedRooms, setAllocatedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllocatedRooms = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/hostel-application`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Filter only approved applications with room numbers
        const approvedRooms = response.data.filter(app => 
          app.isApplicationApproved && app.roomNumber && app.userId
        );
        
        setAllocatedRooms(approvedRooms);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching allocated rooms:', err);
        setError('Failed to load room allocation data');
        setLoading(false);
      }
    };

    fetchAllocatedRooms();
  }, []);

  return (
    <div className="admin-page">
      <h2 className="page-title">Allocated Rooms</h2>
      <div className="table-card">
        {loading ? (
          <p>Loading room allocation data...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : allocatedRooms.length === 0 ? (
          <p>No rooms have been allocated yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No</th>
                <th>Course</th>
                <th>Email</th>
                <th>Room No</th>
                <th>Gender</th>
              </tr>
            </thead>
            <tbody>
              {allocatedRooms.map((student) => (
                <tr key={student._id}>
                  <td>{student.userId?.name}</td>
                  <td>{student.rollNumber}</td>
                  <td>{student.course}</td>
                  <td>{student.userId?.email}</td>
                  <td>{student.roomNumber}</td>
                  <td>{student.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllocatedRooms;

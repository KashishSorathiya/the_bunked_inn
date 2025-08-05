import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ApplyHostel.css";

const ApplyHostel = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [course, setCourse] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/hostel-application/apply",
        { rollNumber, course, gender },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      // Optionally clear form after success:
      setRollNumber("");
      setCourse("");
      setGender("");
    } catch (err) {
      console.error(err);
      toast.error("❌ " + (err.response?.data?.message || "Submission failed"));
    }
  };

  return (
    <div className="apply-hostel">
      <h2>🏢 Hostel Application</h2>
      <p>Fill out this form to apply for hostel accommodation.</p>
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

        <label>Gender:</label>
        <div className="gender-radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={gender === "male"}
              onChange={(e) => setGender(e.target.value)}
              required
            />
            Male
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={gender === "female"}
              onChange={(e) => setGender(e.target.value)}
            />
            Female
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="gender"
              value="other"
              checked={gender === "other"}
              onChange={(e) => setGender(e.target.value)}
            />
            Other
          </label>
        </div>

        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
};

export default ApplyHostel;

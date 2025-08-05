import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import "./Register.css";

const Register = () => {
  const navigate = useNavigate(); // ✅ INIT

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      setMessage("✅ Registered successfully!");
      console.log("Registered:", res.data);
      setFormData({ name: "", email: "", password: "" });

      // ✅ Redirect to login
      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Registration failed");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-box">
        <h2 className="register-heading">📝 Register</h2>
        <p className="subtext">Please fill your details to register</p>
        {message && (
          <p className="message" style={{ color: message.startsWith("✅") ? "green" : "red" }}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="College Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;

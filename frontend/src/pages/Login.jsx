import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Store token
        localStorage.setItem("token", data.token);

        // ✅ Store student info (you must make sure backend sends these fields)
        localStorage.setItem("student", JSON.stringify({
          name: data.user.name,
          hostelStatus: {
            applied: data.user.applied,
            verified: data.user.verified,
            roomNumber: data.user.roomNumber,
          }
        }));

        console.log("Logged in user:", data.user);
        setMessage("✅ Login successful!");

        // ✅ Redirect by role
        if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/student-dashboard");
        }

      } else {
        setMessage("❌ " + data.message);
      }

    } catch (err) {
      console.error(err);
      setMessage("❌ Login failed");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>🔐 Login</h2>
        <p className="subtext">Please login to continue</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="College Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>

        {message && <p className="message">{message}</p>}

        <p style={{ marginTop: "10px" }}>
          ❌ Not registered yet? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

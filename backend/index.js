const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const hostelApplicationRoute = require('./routes/hostelRoutes');
const roomChangeRoutes = require("./routes/roomChangeRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

// Use routes
app.use("/api/auth", authRoutes);
app.use('/api/hostel-application', hostelApplicationRoute);
app.use("/api/room-change", roomChangeRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

// Dummy route
app.get("/", (req, res) => res.send("API Running"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

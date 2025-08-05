const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Dummy route
app.get("/", (req, res) => res.send("API Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const hostelApplicationRoute = require("./routes/hostelRoutes");
app.use("/api/hostel-application", hostelApplicationRoute);

const roomChangeRoutes = require('./routes/roomChangeRoutes');
app.use('/api/room-change', roomChangeRoutes);



const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const existing = await User.findOne({ email: "admin@dau.ac.in" });
    if (existing) {
      console.log("Admin already exists");
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

   const admin = new User({
  name: "Admin",
  email: "admin@dau.ac.in",  // ← new email
  password: hashedPassword,
  gender: "Other",
  role: "admin",
});


    await admin.save();
    console.log("✅ Admin user created successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  });

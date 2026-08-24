require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
const requestLogger = require("./middleware/requestLogger");
app.use(requestLogger);

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const leaveTypesRoutes = require("./routes/leaveTypes");
const leavesRoutes = require("./routes/leaves");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/leave-types", leaveTypesRoutes);
app.use("/api/v1/leaves", leavesRoutes);

// Global error handler (last middleware)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Something went wrong"
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

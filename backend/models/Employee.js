const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["employee", "hr"],
    default: "employee"
  },
  password: {
    type: String,
    required: true
  },
  leaveBalance: {
    type: Number,
    default: 20,
    min: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);

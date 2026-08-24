const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  leaveTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LeaveType",
    required: true
  },
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  days: {
    type: Number,
    required: true,
    min: 1
  },
  reason: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "cancelled"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);

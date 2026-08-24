const mongoose = require("mongoose");

const leaveTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Casual", "Sick", "Earned", "CompOff"]
  },
  maxDaysPerYear: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("LeaveType", leaveTypeSchema);

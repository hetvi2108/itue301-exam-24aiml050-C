const express = require("express");
const LeaveType = require("../models/LeaveType");

const router = express.Router();

// GET /api/v1/leave-types
// Return all leave types (public endpoint)
router.get("/", async (req, res) => {
  try {
    const leaveTypes = await LeaveType.find();

    res.status(200).json({
      success: true,
      data: leaveTypes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch leave types"
    });
  }
});

module.exports = router;

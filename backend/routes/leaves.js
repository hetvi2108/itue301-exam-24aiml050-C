const express = require("express");
const LeaveRequest = require("../models/LeaveRequest");
const Employee = require("../models/Employee");
const authGuard = require("../middleware/authGuard");

const router = express.Router();

// POST /api/v1/leaves
// Apply for leave (protected)
router.post("/", authGuard, async (req, res) => {
  try {
    const { leaveTypeId, fromDate, toDate, days, reason } = req.body;

    if (!leaveTypeId || !fromDate || !toDate || !days) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const employee = req.employee;

    // Check if employee has enough leave balance
    if (days > employee.leaveBalance) {
      return res.status(400).json({
        success: false,
        message: "Insufficient leave balance"
      });
    }

    // Create leave request
    const leaveRequest = await LeaveRequest.create({
      employeeId: employee._id,
      leaveTypeId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      days,
      reason
    });

    // Deduct days from employee leave balance
    await Employee.findByIdAndUpdate(
      employee._id,
      { leaveBalance: employee.leaveBalance - days },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Leave request submitted successfully",
      data: leaveRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create leave request"
    });
  }
});

// GET /api/v1/leaves/my
// Get current employee's leave requests (protected)
router.get("/my", authGuard, async (req, res) => {
  try {
    const employee = req.employee;

    const leaves = await LeaveRequest.find({ employeeId: employee._id })
      .populate("leaveTypeId", "name maxDaysPerYear");

    res.status(200).json({
      success: true,
      data: leaves
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch leave requests"
    });
  }
});

// PATCH /api/v1/leaves/:id/status
// Update leave request status (protected)
router.patch("/:id/status", authGuard, async (req, res) => {
  try {
    const { status } = req.body;
    const leaveId = req.params.id;

    const ALLOWED = ["approved", "rejected"];

    if (!status || !ALLOWED.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'approved' or 'rejected'"
      });
    }

    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }
    );

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Leave status updated",
      data: leaveRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update leave status"
    });
  }
});

module.exports = router;

const express = require("express");
const Employee = require("../models/Employee");

const router = express.Router();

// POST /api/v1/auth/login
// Authenticate employee and return token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // For exam purposes, accept any password
    // In production, use bcrypt to hash and compare passwords
    if (password !== employee.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Token is simply the employee ID for exam purposes
    const token = employee._id.toString();

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        employee: {
          id: employee._id,
          name: employee.name,
          email: employee.email,
          role: employee.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

module.exports = router;

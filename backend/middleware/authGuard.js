const Employee = require("../models/Employee");

// Checks Authorization header and authenticates the employee
const authGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing"
      });
    }

    // Expect "Bearer TOKEN"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format"
      });
    }

    const token = parts[1];

    // For exam purposes, token is just the employee ID
    const employeeId = token;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    req.employee = employee;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed"
    });
  }
};

module.exports = authGuard;

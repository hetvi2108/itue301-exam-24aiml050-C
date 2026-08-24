// This file shows how to seed the database with sample data
// Run this manually in MongoDB Compass or mongosh after starting the server

// ========== SEED DATA ==========

// --- EMPLOYEES ---
db.employees.insertMany([
  {
    "name": "John Doe",
    "email": "john@example.com",
    "department": "IT",
    "designation": "Software Engineer",
    "role": "employee",
    "password": "password123",
    "leaveBalance": 20,
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "name": "Sarah Manager",
    "email": "sarah@example.com",
    "department": "HR",
    "designation": "HR Manager",
    "role": "hr",
    "password": "password123",
    "leaveBalance": 25,
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
]);

// --- LEAVE TYPES ---
db.leavetypes.insertMany([
  {
    "name": "Casual",
    "maxDaysPerYear": 12,
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "name": "Sick",
    "maxDaysPerYear": 10,
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "name": "Earned",
    "maxDaysPerYear": 20,
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "name": "CompOff",
    "maxDaysPerYear": 5,
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
]);

// Run these commands in MongoDB Compass or mongosh:
// 1. Select the database: use leave-management
// 2. Copy and paste the employee insertMany command
// 3. Copy and paste the leavetype insertMany command

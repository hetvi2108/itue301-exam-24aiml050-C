# ITUE301 Project - Quick Start Guide

## Overview
Complete Employee Leave Management System built with React, Express.js, and MongoDB.

## Prerequisites
- Node.js and npm installed
- MongoDB running locally or MongoDB Atlas connection string
- Port 3000 and 5000 available

## Setup Steps

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` in the root directory:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/leave-management
```

### 3. Seed Database

Using MongoDB Compass or mongosh, connect to your database and run:

**Create employees:**
```javascript
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
```

**Create leave types:**
```javascript
db.leavetypes.insertMany([
  { "name": "Casual", "maxDaysPerYear": 12, "createdAt": new Date(), "updatedAt": new Date() },
  { "name": "Sick", "maxDaysPerYear": 10, "createdAt": new Date(), "updatedAt": new Date() },
  { "name": "Earned", "maxDaysPerYear": 20, "createdAt": new Date(), "updatedAt": new Date() },
  { "name": "CompOff", "maxDaysPerYear": 5, "createdAt": new Date(), "updatedAt": new Date() }
]);
```

### 4. Start Backend

```bash
cd backend
npm start
```

You should see:
```
Server running on port 5000
Connected to MongoDB
```

### 5. Start Frontend (in another terminal)

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000` in your browser.

## Testing

### Login
- Email: `john@example.com`
- Password: `password123` (or any password for demo)

### Features to Test

1. **My Leaves Page**
   - See welcome message with employee name
   - View leave requests
   - Filter by status (All, Pending, Approved, Rejected)
   - See colored status badges

2. **Apply Leave**
   - Select leave type
   - Choose dates
   - See calculated days
   - Add reason
   - Submit form

3. **HR Panel** (login as sarah@example.com)
   - Access HR-only page
   - See "Access Denied" from regular employee account

## Important Files

**Backend:**
- `backend/server.js` - Main server file
- `backend/models/` - Database schemas
- `backend/middleware/` - Logging and authentication
- `backend/routes/` - API endpoints

**Frontend:**
- `frontend/src/App.jsx` - Main routing
- `frontend/src/context/AuthContext.jsx` - Authentication state
- `frontend/src/pages/` - Page components
- `frontend/src/components/` - Reusable components

## Key Implementation Details

### Authentication
- Token is employee ID (simple for exam)
- No password hashing (demo)
- Protected routes check for token

### Leave Balance
- Deducted when leave is created
- Validated before creating leave request
- Shows error if insufficient balance

### Status Filter
- Client-side filtering only
- No additional API calls
- Works on already-fetched data

### LeaveRequestCard
Displays:
- From Date
- To Date
- Total Days
- Leave Type
- Reason
- Status (colored badge)

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in .env
- Verify database name matches

**Port Already in Use**
- Backend: Change PORT in .env
- Frontend: Modify vite.config.js

**Login Fails**
- Verify employee exists in database
- Check email spelling
- Seed data may need to be reinserted

**Frontend Can't Connect to Backend**
- Ensure backend is running on port 5000
- Check backend console for errors
- Verify API URL in frontend code (http://localhost:5000)

## File Locations Summary

```
backend/
  ├── server.js                 (Express server setup)
  ├── models/
  │   ├── Employee.js           (Employee schema)
  │   ├── LeaveType.js          (LeaveType schema)
  │   └── LeaveRequest.js       (LeaveRequest schema)
  ├── middleware/
  │   ├── requestLogger.js      (Request logging)
  │   └── authGuard.js          (Authentication)
  └── routes/
      ├── auth.js               (Login endpoint)
      ├── leaves.js             (Leave CRUD)
      └── leaveTypes.js         (Get leave types)

frontend/
  ├── src/
  │   ├── App.jsx               (Main routing)
  │   ├── context/
  │   │   └── AuthContext.jsx   (Auth state)
  │   ├── pages/
  │   │   ├── LoginPage.jsx
  │   │   ├── ApplyLeavePage.jsx
  │   │   ├── MyLeavesPage.jsx
  │   │   └── HRPanel.jsx
  │   └── components/
  │       ├── Navigation.jsx
  │       └── LeaveRequestCard.jsx
  └── index.html                (Entry HTML)
```

## Ready to Start!

All components are implemented and ready to run. Follow the setup steps above and you should have a working application in minutes.

Good luck with your ITUE301 examination!

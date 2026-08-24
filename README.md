# Employee Leave Management System
## ITUE301 Practical Exam - Set C (24AIML050)

A comprehensive full-stack web application for managing employee leave requests, built with **React**, **Express.js**, and **MongoDB**.

---

## 📋 Project Overview

This is a complete Leave Management System designed for B.Tech Semester 5 practical examination. The application allows employees to apply for leaves, track their leave balances, and enables HR personnel to manage leave requests.

### Key Features
- ✅ **User Authentication** - Token-based login system
- ✅ **Leave Application** - Apply for leaves with date selection and reason
- ✅ **Leave Tracking** - View personal leave applications and status
- ✅ **Balance Management** - Automatic leave balance calculation and deduction
- ✅ **HR Dashboard** - Manage and approve/reject leave requests (role-based)
- ✅ **Role-Based Access Control** - Employee and HR roles with different permissions
- ✅ **Real-time Validation** - Client and server-side validation
- ✅ **Responsive Design** - Works on desktop and mobile devices

---

## 🏗️ System Architecture

### Technology Stack

**Frontend:**
- React 18.x - UI library
- React Router DOM 6.x - Client-side routing
- Vite - Build tool
- Context API - State management
- CSS3 - Styling

**Backend:**
- Node.js - JavaScript runtime
- Express.js - Web framework
- MongoDB - NoSQL database
- Mongoose - ODM (Object Data Modeling)
- CORS - Cross-Origin Resource Sharing

**Development Tools:**
- npm - Package manager
- MongoDB Compass - Database management
- Postman/cURL - API testing

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (React)                     │
│  ┌──────────────┬──────────────┬──────────────────────┐   │
│  │ LoginPage    │ ApplyLeavePage│ MyLeavesPage/HRPanel │   │
│  └──────────────┴──────────────┴──────────────────────┘   │
│         ↓ (HTTP/HTTPS with Bearer Token)                   │
├─────────────────────────────────────────────────────────────┤
│              SERVER LAYER (Express.js)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Middleware: requestLogger, authGuard, errorHandler  │   │
│  │ Routes: /api/v1/auth  /api/v1/leaves  /api/v1/types│   │
│  └─────────────────────────────────────────────────────┘   │
│         ↓ (Database Queries)                               │
├─────────────────────────────────────────────────────────────┤
│          DATABASE LAYER (MongoDB + Mongoose)                │
│  ┌──────────────┬──────────────┬──────────────────────┐   │
│  │ Employees    │ LeaveTypes   │ LeaveRequests        │   │
│  │ Collection   │ Collection   │ Collection           │   │
│  └──────────────┴──────────────┴──────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Project Structure

```
itue301-exam-24aiml050-C/
├── backend/                          # Express.js server
│   ├── server.js                     # Main server file
│   ├── package.json                  # Backend dependencies
│   ├── .env                          # Configuration (local)
│   ├── middleware/
│   │   ├── requestLogger.js          # Request logging middleware
│   │   └── authGuard.js              # Authentication middleware
│   ├── models/
│   │   ├── Employee.js               # Employee schema
│   │   ├── LeaveType.js              # Leave type schema
│   │   └── LeaveRequest.js           # Leave request schema
│   └── routes/
│       ├── auth.js                   # Authentication endpoints
│       ├── leaves.js                 # Leave management endpoints
│       └── leaveTypes.js             # Leave types endpoint
│
├── frontend/                         # React application
│   ├── index.html                    # HTML entry point
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Vite configuration
│   └── src/
│       ├── main.jsx                  # React bootstrap
│       ├── App.jsx                   # Main app with routing
│       ├── App.css                   # Global styles
│       ├── index.css                 # Base styles
│       ├── context/
│       │   └── AuthContext.jsx       # Authentication state
│       ├── pages/
│       │   ├── LoginPage.jsx         # Login form
│       │   ├── ApplyLeavePage.jsx    # Leave application
│       │   ├── MyLeavesPage.jsx      # Leave tracking
│       │   └── HRPanel.jsx           # HR dashboard
│       ├── components/
│       │   ├── Navigation.jsx        # Navigation bar
│       │   └── LeaveRequestCard.jsx  # Leave display card
│       └── styles/                   # Component CSS files
│
├── .env.example                      # Environment template
├── .gitignore                        # Git ignore rules
├── README.md                         # This file
├── QUICK_START.md                    # Quick setup guide
└── package-lock.json                 # Dependency lock file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** (comes with Node.js)
- Ports **3000** and **5000** available

### Step 1: Clone & Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies (in another terminal)
cd frontend
npm install
```

### Step 2: Setup Environment

Create `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/leave-management
```

### Step 3: Seed Database

Using MongoDB Compass, connect to your database and create two collections:

**Collection: employees**
```javascript
db.employees.insertMany([
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456",
    "department": "IT",
    "designation": "Software Engineer",
    "role": "employee",
    "leaveBalance": {
      "casual": 12,
      "sick": 10,
      "earned": 15,
      "compOff": 5
    },
    "createdAt": new Date()
  },
  {
    "name": "Sarah Manager",
    "email": "sarah@example.com",
    "password": "123456",
    "department": "HR",
    "designation": "HR Manager",
    "role": "hr",
    "leaveBalance": {
      "casual": 12,
      "sick": 10,
      "earned": 15,
      "compOff": 5
    },
    "createdAt": new Date()
  }
])
```

**Collection: leavetypes**
```javascript
db.leavetypes.insertMany([
  {"name": "Casual", "maxDaysPerYear": 12, "createdAt": new Date()},
  {"name": "Sick", "maxDaysPerYear": 10, "createdAt": new Date()},
  {"name": "Earned", "maxDaysPerYear": 15, "createdAt": new Date()},
  {"name": "CompOff", "maxDaysPerYear": 5, "createdAt": new Date()}
])
```

### Step 4: Start Backend

```bash
cd backend
npm start
```

Expected output:
```
Server running on port 5000
Connected to MongoDB
```

### Step 5: Start Frontend

In another terminal:

```bash
cd frontend
npm run dev
```

Open browser and navigate to: **http://localhost:3000**

---

## 🔑 Default Login Credentials

| Email | Password | Role |
|-------|----------|------|
| john@example.com | 123456 | Employee |
| sarah@example.com | 123456 | HR |

---

## 📡 API Endpoints

All endpoints require Bearer token in Authorization header except `/auth/login` and `/leave-types`.

### Authentication

**POST /api/v1/auth/login**
- Request: `{ "email": "john@example.com", "password": "123456" }`
- Response: `{ "token": "...", "name": "John Doe", "role": "employee" }`

### Leaves

**POST /api/v1/leaves** (Protected)
- Apply for new leave
- Request body: `{ "leaveTypeId": "...", "fromDate": "2024-09-10", "toDate": "2024-09-12", "days": 3, "reason": "..." }`

**GET /api/v1/leaves/my** (Protected)
- Fetch logged-in employee's leaves
- Query params: `?status=pending` (optional)

**PATCH /api/v1/leaves/:leaveId** (Protected - HR only)
- Update leave status
- Request body: `{ "status": "approved" }` or `{ "status": "rejected" }`

### Leave Types

**GET /api/v1/leave-types**
- Public endpoint
- Returns all leave types available

---

## 🔐 Authentication & Security

### Token-Based Authentication
- Employees log in with email and password
- Server returns employee ID as token
- Token stored in React Context and localStorage
- Token sent with every protected request via Authorization header: `Bearer {token}`

### Protected Routes
- `/apply` - Requires valid token (all employees)
- `/my-leaves` - Requires valid token (all employees)
- `/hr` - Requires valid token AND "hr" role

### Middleware Stack
1. **requestLogger** - Logs all incoming requests
2. **authGuard** - Validates token on protected routes
3. **Global Error Handler** - Catches and formats errors

---

## 🧪 Testing

### Test Cases
| Feature | Test Case | Expected Result |
|---------|-----------|-----------------|
| Login | Valid credentials | Login successful, redirect to /my-leaves |
| Login | Invalid credentials | Error message displayed |
| Apply Leave | Valid leave application | Leave created, balance deducted |
| Apply Leave | Insufficient balance | Error shown, leave not created |
| View Leaves | Filter by status | Only matching leaves displayed |
| HR Access | HR user accesses /hr | HR Panel loads |
| HR Access | Regular employee accesses /hr | Redirect to /my-leaves |

### API Testing with cURL

**Test Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'
```

**Test Apply Leave:**
```bash
curl -X POST http://localhost:5000/api/v1/leaves \
  -H "Authorization: Bearer 507f1f77bcf86cd799439011" \
  -H "Content-Type: application/json" \
  -d '{
    "leaveTypeId": "...",
    "fromDate": "2024-09-10",
    "toDate": "2024-09-12",
    "days": 3,
    "reason": "Personal work"
  }'
```

---

## 📋 Database Schema

### Employees Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String,
  department: String,
  designation: String,
  role: String ("employee" | "hr"),
  leaveBalance: {
    casual: Number,
    sick: Number,
    earned: Number,
    compOff: Number
  },
  createdAt: Date
}
```

### LeaveTypes Collection
```javascript
{
  _id: ObjectId,
  name: String ("Casual" | "Sick" | "Earned" | "CompOff"),
  maxDaysPerYear: Number,
  createdAt: Date
}
```

### LeaveRequests Collection
```javascript
{
  _id: ObjectId,
  employeeId: ObjectId (ref: Employee),
  leaveTypeId: ObjectId (ref: LeaveType),
  fromDate: Date,
  toDate: Date,
  days: Number,
  reason: String,
  status: String ("pending" | "approved" | "rejected"),
  appliedAt: Date,
  updatedAt: Date
}
```

---

## 🎨 Frontend Components

### Pages

**LoginPage** (`src/pages/LoginPage.jsx`)
- Email and password form
- Error handling and validation
- Redirect on successful login

**ApplyLeavePage** (`src/pages/ApplyLeavePage.jsx`)
- Form to select leave type, dates, and reason
- Auto-calculates number of days
- Validates leave balance before submission
- Success/error notifications

**MyLeavesPage** (`src/pages/MyLeavesPage.jsx`)
- Displays all leave applications
- Filter by status (All, Pending, Approved, Rejected)
- Shows leave details and current balance

**HRPanel** (`src/pages/HRPanel.jsx`)
- HR-only dashboard (lazy-loaded)
- Manage employee leave requests
- Approve or reject leaves

### Components

**Navigation** (`src/components/Navigation.jsx`)
- Conditional menu based on authentication and role
- Login/Logout links
- Role-specific menu items

**LeaveRequestCard** (`src/components/LeaveRequestCard.jsx`)
- Displays individual leave application
- Shows dates, days, type, reason, and status
- Status badge with color coding

---

## ⚙️ Configuration

### Environment Variables (.env)

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/leave-management
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/leave-management
```

### Vite Configuration
Frontend build tool configuration in `frontend/vite.config.js`

### CORS Configuration
Enabled in `backend/server.js` for cross-origin requests from frontend

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:** Ensure MongoDB is running and MONGO_URI in .env is correct
```bash
# Check MongoDB status (Windows)
sc query MongoDB

# Start MongoDB (Windows)
net start MongoDB
```

### Issue: "Port 5000 already in use"
**Solution:** Change PORT in .env or kill process using port 5000
```bash
# Find and kill process (Windows PowerShell)
Get-Process -Name node | Stop-Process
```

### Issue: "Frontend showing Cannot GET /"
**Solution:** Ensure backend is running and CORS is enabled
```bash
# Verify backend is running
curl http://localhost:5000/api/v1/leave-types
```

### Issue: "Login button not working"
**Solution:** Check browser console for errors, ensure database has employee records

---

## 📝 Development Workflow

### Backend Development
```bash
cd backend
npm start           # Start server in development
npm test            # Run tests (if available)
```

### Frontend Development
```bash
cd frontend
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

### Adding New Features

1. **Backend:** Add new route in `routes/` folder
2. **Models:** Update schemas in `models/` if needed
3. **Frontend:** Add new page in `pages/` folder
4. **Routing:** Update `src/App.jsx` with new route
5. **Testing:** Test API endpoints with cURL/Postman

---

## 📚 Code Examples

### Making Protected API Call (Frontend)

```javascript
const fetchMyLeaves = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/v1/leaves/my', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

### Creating Protected Route (Frontend)

```javascript
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

<Route path="/my-leaves" element={<ProtectedRoute><MyLeavesPage /></ProtectedRoute>} />
```

### Error Handling (Backend)

```javascript
try {
  // Perform operation
} catch (error) {
  res.status(500).json({ error: error.message });
}
```

---

## 🎓 Learning Outcomes

After completing this project, you will understand:

✅ Full-stack web development with React and Express.js  
✅ RESTful API design and implementation  
✅ Database modeling with MongoDB and Mongoose  
✅ Authentication and authorization patterns  
✅ Client-side state management with React Context  
✅ Form handling and validation  
✅ Error handling and debugging  
✅ Deployment considerations for production  

---

## 📄 License

This project is created for educational purposes as part of ITUE301 practical examination.

---

## 👤 Author

**Roll Number:** 24AIML050  
**Course:** ITUE301 - Web Development  
**Institution:** [Your Institution Name]  
**Date:** August 2024

---

## 📞 Support

For issues or questions:
1. Check the [QUICK_START.md](QUICK_START.md) for setup help
2. Review error messages in browser console and terminal
3. Verify database connection and data seeding
4. Ensure all dependencies are installed with `npm install`

---

**Last Updated:** August 24, 2024  
**Status:** ✅ Complete and Ready for Submission
...

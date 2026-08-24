# Task 4: REST API Consumption in React

## Overview
This document explains how the React frontend consumes the Express.js REST API with proper error handling, authentication, and state management.

---

## 1. Authentication Context - State Management

### File: [frontend/src/context/AuthContext.jsx](frontend/src/context/AuthContext.jsx)

```jsx
import React, { createContext, useState } from "react";

// Create AuthContext for global state management
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [employee, setEmployee] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  // Store login data in global state
  const login = (employeeData, authToken, userRole) => {
    setEmployee(employeeData);
    setToken(authToken);
    setRole(userRole);
  };

  // Clear state on logout
  const logout = () => {
    setEmployee(null);
    setToken(null);
    setRole(null);
  };

  const value = {
    employee,
    token,
    role,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Key Points:**
- Stores `employee`, `token`, and `role` globally
- `login()` sets state after successful authentication
- `logout()` clears state on user logout
- Wrapped around entire app in `main.jsx`

---

## 2. Login API Call - POST Request

### File: [frontend/src/pages/LoginPage.jsx](frontend/src/pages/LoginPage.jsx)

```jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Make POST request to login endpoint
      const response = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      // Check if request was successful
      if (!response.ok) {
        setError(result.message || "Login failed");
        setLoading(false);
        return;
      }

      // Extract token and employee data from response
      const { token, employee } = result.data;
      
      // Store in AuthContext
      login(employee, token, employee.role);

      // Redirect to my-leaves page
      navigate("/my-leaves");
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Employee Leave Management</h1>
        <h2>Login</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

**API Flow:**
```
User Input (email, password)
         ↓
fetch("http://localhost:5000/api/v1/auth/login") [POST]
         ↓
{method: "POST", headers: {"Content-Type": "application/json"}, body}
         ↓
Backend validates credentials
         ↓
Returns {token, employee, role}
         ↓
Store in AuthContext
         ↓
Redirect to /my-leaves
```

**Error Handling:**
- Network errors caught in `catch` block
- Server errors checked with `!response.ok`
- User-friendly error messages displayed

---

## 3. Fetching Data - GET Request with Authentication

### File: [frontend/src/pages/MyLeavesPage.jsx](frontend/src/pages/MyLeavesPage.jsx)

```jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function MyLeavesPage() {
  const { employee, token } = useContext(AuthContext);

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  // Fetch leaves when component mounts
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        // Make GET request with Bearer token
        const response = await fetch("http://localhost:5000/api/v1/leaves/my", {
          headers: {
            "Authorization": `Bearer ${token}`  // ← Include token for authentication
          }
        });

        if (!response.ok) {
          setError("Failed to load your leave history.");
          setLoading(false);
          return;
        }

        const result = await response.json();
        setLeaves(result.data);
      } catch (err) {
        setError("Failed to load your leave history.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchLeaves();
    }
  }, [token]);

  // Filter leaves based on selected status
  const filteredLeaves = leaves.filter(
    (leave) => filter === "All" || leave.status === filter
  );

  return (
    <div className="my-leaves-container">
      <h1>Welcome, {employee?.name}</h1>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <>
          <div className="filter-section">
            <label htmlFor="statusFilter">Filter by Status:</label>
            <select
              id="statusFilter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="leaves-list">
            {filteredLeaves.length === 0 ? (
              <p className="no-leaves">No leave requests found.</p>
            ) : (
              filteredLeaves.map((leave) => (
                <div key={leave._id} className="leave-item">
                  {/* Display leave details */}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
```

**Key Concepts:**

1. **Bearer Token in Header:**
   ```javascript
   headers: {
     "Authorization": `Bearer ${token}`  // Token from AuthContext
   }
   ```

2. **useEffect Hook:**
   - Runs once when component mounts
   - Dependency on `token` - refetches if token changes
   - Prevents infinite loops

3. **Loading State:**
   - Shows loading message while fetching
   - Prevents UI interactions during fetch

4. **Error Handling:**
   - Catches network errors
   - Checks HTTP status codes
   - Displays user-friendly messages

---

## 4. Creating/Posting Data - POST with Bearer Token

### File: [frontend/src/pages/ApplyLeavePage.jsx](frontend/src/pages/ApplyLeavePage.jsx)

```jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ApplyLeavePage() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    leaveTypeId: "",
    fromDate: "",
    toDate: "",
    reason: ""
  });

  const [days, setDays] = useState(0);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Fetch leave types (no authentication needed)
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/leave-types");
        const result = await response.json();

        if (result.success) {
          setLeaveTypes(result.data);
        }
      } catch (error) {
        console.error("Error fetching leave types:", error);
      }
    };

    fetchLeaveTypes();
  }, []);

  // Calculate days between dates
  const calculateDays = (from, to) => {
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      const diffTime = toDate - fromDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDays(diffDays > 0 ? diffDays : 0);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === "fromDate" || name === "toDate") {
      const newFormData = { ...formData, [name]: value };
      calculateDays(newFormData.fromDate, newFormData.toDate);
    }
  };

  // Submit leave application
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (days <= 0) {
      setMessage("Invalid date range");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      // POST request with Bearer token
      const response = await fetch("http://localhost:5000/api/v1/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`  // ← Include token
        },
        body: JSON.stringify({
          ...formData,
          days
        })
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Failed to apply leave");
        setMessageType("error");
      } else {
        setMessage("Leave applied successfully!");
        setMessageType("success");
        
        // Reset form
        setFormData({
          leaveTypeId: "",
          fromDate: "",
          toDate: "",
          reason: ""
        });
        setDays(0);

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/my-leaves");
        }, 2000);
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
      setMessageType("error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-leave-container">
      <h1>Apply for Leave</h1>

      {message && (
        <p className={`message ${messageType}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="leaveTypeId">Leave Type:</label>
          <select
            id="leaveTypeId"
            name="leaveTypeId"
            value={formData.leaveTypeId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map((type) => (
              <option key={type._id} value={type._id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fromDate">From Date:</label>
          <input
            id="fromDate"
            type="date"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="toDate">To Date:</label>
          <input
            id="toDate"
            type="date"
            name="toDate"
            value={formData.toDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Number of Days: <strong>{days}</strong></label>
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason:</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            rows="4"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Leave Application"}
        </button>
      </form>
    </div>
  );
}
```

**POST Request Flow:**
```
User fills form
         ↓
Click Submit
         ↓
Validate dates (days > 0)
         ↓
fetch("http://localhost:5000/api/v1/leaves") [POST]
{
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer {token}"
  },
  body: {leaveTypeId, fromDate, toDate, days, reason}
}
         ↓
Backend validates balance
         ↓
Create leave request & deduct balance
         ↓
Return success response
         ↓
Show success message
         ↓
Redirect to /my-leaves
```

---

## 5. API Call Patterns

### Pattern 1: GET with Authentication
```javascript
const fetchData = async () => {
  const response = await fetch("http://localhost:5000/api/v1/leaves/my", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  const data = await response.json();
};
```

### Pattern 2: POST with Data
```javascript
const submitData = async (payload) => {
  const response = await fetch("http://localhost:5000/api/v1/leaves", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
};
```

### Pattern 3: PATCH for Updates
```javascript
const updateStatus = async (leaveId, status) => {
  const response = await fetch(
    `http://localhost:5000/api/v1/leaves/${leaveId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    }
  );
  const data = await response.json();
};
```

---

## 6. Error Handling Best Practices

### Complete Error Handling Example
```javascript
const makeAPICall = async (url, options = {}) => {
  try {
    // Set default headers
    const headers = {
      "Content-Type": "application/json",
      ...options.headers
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Make request
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Parse response
    const data = await response.json();

    // Check HTTP status
    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    // Handle different error types
    if (error instanceof TypeError) {
      console.error("Network error:", error);
      return { error: "Network connection failed" };
    }
    
    console.error("API error:", error);
    return { error: error.message };
  }
};
```

---

## 7. State Management Flow

### Complete Flow Diagram
```
User Action
    ↓
Component State Updates
    ↓
API Call (fetch)
    ↓
Loading State = true
    ↓
Backend Processing
    ↓
Response Received
    ↓
Check response.ok
    ↓
Success ────→ Update State ────→ Show Success Message
    ↓
Error ────────→ Set Error ────────→ Show Error Message
    ↓
Loading State = false
    ↓
Re-render UI
```

---

## 8. Security Best Practices

### 1. Never Expose Token in Request Body
```javascript
// ❌ WRONG
body: JSON.stringify({ token, data })

// ✅ CORRECT
headers: { "Authorization": `Bearer ${token}` }
```

### 2. Validate Response Format
```javascript
// Validate response structure
if (result.success && result.data) {
  // Process data
} else {
  throw new Error("Invalid response format");
}
```

### 3. Clean Up Token on Logout
```javascript
const logout = () => {
  setToken(null);
  localStorage.removeItem("token");
  navigate("/login");
};
```

### 4. Handle Token Expiration
```javascript
// Check for 401 (Unauthorized) response
if (response.status === 401) {
  logout(); // Clear token and redirect to login
}
```

---

## 9. Common API Endpoints Reference

| Endpoint | Method | Authentication | Purpose |
|----------|--------|-----------------|---------|
| `/api/v1/auth/login` | POST | No | User login |
| `/api/v1/leave-types` | GET | No | Fetch leave types |
| `/api/v1/leaves` | POST | Yes | Apply for leave |
| `/api/v1/leaves/my` | GET | Yes | Fetch user's leaves |
| `/api/v1/leaves/:id/status` | PATCH | Yes | Update leave status |

---

## 10. Viva Questions & Answers

**Q1: Why do we use Bearer tokens in the Authorization header?**
A: Bearer tokens in the header are more secure than including them in the request body. They're part of the HTTP standard for authentication and are handled separately from data.

**Q2: What happens if the token expires?**
A: The backend returns a 401 Unauthorized response. The frontend should catch this and redirect the user to login, clearing the token.

**Q3: How do you handle race conditions in API calls?**
A: Use a loading state to prevent duplicate requests. Also, store requestID or use abort signals to cancel previous requests if a new one is made.

**Q4: Why use useEffect for API calls?**
A: useEffect ensures the API call runs after the component mounts. The dependency array controls when to refetch. Prevents infinite loops and memory leaks.

**Q5: How do you prevent network requests from blocking the UI?**
A: Use async/await in useEffect, show loading indicators, and disable form submissions during requests. Use state to manage loading state separately.

**Q6: What's the difference between response.ok and status code 200?**
A: `response.ok` returns true for status codes 200-299 (all success codes), while checking for exactly 200 only accepts that specific code.

**Q7: How do you validate data from the API?**
A: Check response structure, validate data types, verify required fields exist. Never trust client-received data - always validate on backend too.

**Q8: How do you handle CORS errors?**
A: CORS is a browser security feature. Backend must allow the frontend's origin in CORS headers. Add `Access-Control-Allow-Origin` header in backend.

---

## 11. Testing API Integration

### Example: Test Login Flow
```javascript
// Test case: Login with valid credentials
async function testLogin() {
  const response = await fetch("http://localhost:5000/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      email: "john@example.com", 
      password: "123456" 
    })
  });
  
  const result = await response.json();
  
  console.assert(response.ok, "Login should succeed");
  console.assert(result.data.token, "Token should be provided");
  console.assert(result.data.employee.name, "Employee name should be provided");
}
```

---

## Summary

### Key Takeaways:
✅ Use Context API for global auth state  
✅ Always include Bearer token in protected routes  
✅ Handle errors gracefully with try-catch  
✅ Use loading states to prevent duplicate requests  
✅ Parse JSON responses carefully  
✅ Redirect on authentication errors (401)  
✅ Show user-friendly error messages  
✅ Use useEffect properly to avoid infinite loops  
✅ Validate API responses before using data  
✅ Clean up resources on logout  

---

**Related Files:**
- [Frontend Source](frontend/src/)
- [Backend Routes](backend/routes/)
- [README.md](README.md)
- [QUICK_START.md](QUICK_START.md)

**Last Updated:** August 24, 2024

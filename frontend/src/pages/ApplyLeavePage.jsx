import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./ApplyLeavePage.css";

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

  // Fetch leave types on component mount
  React.useEffect(() => {
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

  // Calculate days when dates change
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
      const response = await fetch("http://localhost:5000/api/v1/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
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
        setTimeout(() => navigate("/my-leaves"), 2000);
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
      setMessageType("error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-leave-container">
      <div className="apply-leave-box">
        <h1>Apply for Leave</h1>

        {message && (
          <p className={`message ${messageType}`}>{message}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="leaveType">Leave Type:</label>
            <select
              id="leaveType"
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
            <label>Total Days:</label>
            <p className="days-display">{days} days</p>
          </div>

          <div className="form-group">
            <label htmlFor="reason">Reason:</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              maxLength="500"
              rows="4"
            ></textarea>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Applying..." : "Apply Leave"}
          </button>
        </form>
      </div>
    </div>
  );
}

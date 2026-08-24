import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import LeaveRequestCard from "../components/LeaveRequestCard";
import "./MyLeavesPage.css";

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
        const response = await fetch("http://localhost:5000/api/v1/leaves/my", {
          headers: {
            "Authorization": `Bearer ${token}`
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
      <div className="my-leaves-content">
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
                  <LeaveRequestCard
                    key={leave._id}
                    fromDate={new Date(leave.fromDate).toLocaleDateString()}
                    toDate={new Date(leave.toDate).toLocaleDateString()}
                    days={leave.days}
                    leaveType={leave.leaveTypeId?.name || "N/A"}
                    reason={leave.reason || "No reason provided"}
                    status={leave.status}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

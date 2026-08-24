import React from "react";
import "./LeaveRequestCard.css";

export default function LeaveRequestCard({
  fromDate,
  toDate,
  days,
  leaveType,
  reason,
  status
}) {
  // Color mapping for status badge
  const colors = {
    pending: "#FFC107",
    approved: "#28A745",
    rejected: "#DC3545",
    cancelled: "#6C757D"
  };

  const badgeColor = colors[status] || "#999";

  return (
    <div className="leave-request-card">
      <div className="card-header">
        <h3>{leaveType}</h3>
        <span
          className="status-badge"
          style={{ backgroundColor: badgeColor }}
        >
          {status}
        </span>
      </div>

      <div className="card-body">
        <div className="card-row">
          <span className="label">From Date:</span>
          <span className="value">{fromDate}</span>
        </div>

        <div className="card-row">
          <span className="label">To Date:</span>
          <span className="value">{toDate}</span>
        </div>

        <div className="card-row">
          <span className="label">Total Days:</span>
          <span className="value">{days}</span>
        </div>

        <div className="card-row">
          <span className="label">Reason:</span>
          <span className="value reason">{reason}</span>
        </div>

        <div className="card-row">
          <span className="label">Status:</span>
          <span className="value">{status}</span>
        </div>
      </div>
    </div>
  );
}

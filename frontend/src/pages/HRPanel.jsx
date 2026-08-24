import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./HRPanel.css";

export default function HRPanel() {
  const { role } = useContext(AuthContext);

  // This page is only accessible to HR users
  // The routing logic handles the role check

  return (
    <div className="hr-panel-container">
      <div className="hr-panel-content">
        <h1>HR Panel</h1>
        <p className="description">
          HR Dashboard for managing leave requests
        </p>

        <div className="hr-section">
          <h2>Manage Leave Requests</h2>
          <p className="coming-soon">
            Leave management features coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}

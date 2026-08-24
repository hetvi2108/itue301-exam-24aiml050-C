import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navigation.css";

export default function Navigation() {
  const { token, logout, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">Leave Management</Link>
        </div>

        <ul className="nav-links">
          {!token ? (
            <li>
              <Link to="/">Login</Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/my-leaves">My Leaves</Link>
              </li>
              <li>
                <Link to="/apply">Apply Leave</Link>
              </li>
              {role === "hr" && (
                <li>
                  <Link to="/hr">HR Panel</Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); 
  };

  const handleChangePassword = () => {
    navigate("/update-password"); 
  };

  return (
    <nav className="navbar">
      <h1>RateMyStore</h1>

      {user && (
        <div className="user-info" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Change Password Button */}
          <button
            onClick={handleChangePassword}
            style={{
              background: "#fff",
              color: "#667eea, #764ba2",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Change Password
          </button>

          {/* Profile Icon */}
          <div
            className="user-profile"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <span
              role="img"
              aria-label="profile"
              style={{ fontSize: "22px", cursor: "pointer" }}
            >
              👤
            </span>
            {showDropdown && (
              <div className="profile-dropdown">
                <p><b>{user.name}</b></p>
                <p>Role: {user.role}</p>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

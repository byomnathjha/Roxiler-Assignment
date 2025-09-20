import React, { useState } from "react";
import axios from "axios";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); 
      const res = await axios.post(
        "http://localhost:5000/api/auth/update-password", 
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Error updating password"
      );
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
        background: "white",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Update Password
      </h2>
      <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input
          type="password"
          placeholder="Enter Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "6px",
          }}
        />
        <input
          type="password"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "6px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            border: "none",
            borderRadius: "6px",
            background: "linear-gradient(45deg, #6a11cb, #2575fc)",
            color: "white",
            cursor: "pointer",
          }}
        >
          Update Password
        </button>
      </form>
      {message && (
        <p style={{ marginTop: "15px", textAlign: "center", color: "red" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default UpdatePassword;

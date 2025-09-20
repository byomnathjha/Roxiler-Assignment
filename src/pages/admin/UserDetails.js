// src/pages/admin/UserDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const res = await API.get(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    };
    fetchUser();
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      <h2>User Details</h2>
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Address:</b> {user.address}</p>
      <p><b>Role:</b> {user.role}</p>
      {user.role === "OWNER" && <p><b>Rating:</b> {user.rating}</p>}
    </div>
  );
}

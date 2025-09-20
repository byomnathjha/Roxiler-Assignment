import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await API.post("/auth/signup", form);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Create Account</h2>
        <p>
          Welcome to <b>RateMyStore</b> 🚀
          <br />
          “Your feedback makes every store better.”
        </p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={onSubmit}>
          <input
            name="name"
            placeholder="Full Name (20-60 chars)"
            onChange={onChange}
            required
          />
          <input name="email" placeholder="Email" onChange={onChange} required />
          <input
            name="address"
            placeholder="Address"
            onChange={onChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={onChange}
            required
          />
          <select name="role" onChange={onChange} value={form.role}>
            <option value="USER">User</option>
            <option value="OWNER">Owner</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit">Sign Up</button>
        </form>

        {/* Switch to login */}
        <div className="divider">or</div>
        <div className="switch-auth">
          <p>Already registered?</p>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

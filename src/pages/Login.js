import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";   

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });

      // save to contex
      login(res.data.user, res.data.token);

      // redirect based on role
      if (res.data.user.role === "ADMIN") {
        nav("/admin");
      } else if (res.data.user.role === "OWNER") {
        nav("/owner");
      } else {
        nav("/user");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        {/* Switch to signup */}
        <div className="divider">or</div>
        <div className="switch-auth">
          <p>Not Registered?</p>
          <Link to="/signup">
            <button>Signup</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

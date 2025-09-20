// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  useEffect(() => {
    
    const token = localStorage.getItem("token");
    if (!token) setUser(null);
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

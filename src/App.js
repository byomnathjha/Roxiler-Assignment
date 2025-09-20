// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UserDashboard from "./pages/user/UserDashboard";
import UpdatePassword from "./pages/user/UpdatePassword";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import Navbar from "./components/Navbar";

// ✅ Admin pages (correct paths)
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageStores from "./pages/admin/ManageStores";
import UserDetails from "./pages/admin/UserDetails";

function RequireAuth({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/signup" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar /> {}
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RequireAuth>
                <ManageUsers />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <RequireAuth>
                <ManageStores />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <RequireAuth>
                <UserDetails />
              </RequireAuth>
            }
          />

          {}
          <Route
            path="/user"
            element={
              <RequireAuth>
                <UserDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/owner"
            element={
              <RequireAuth>
                <OwnerDashboard />
              </RequireAuth>
            }
          />
          <Route
  path="/update-password"
  element={
    <RequireAuth>
      <UpdatePassword />
    </RequireAuth>
  }
/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

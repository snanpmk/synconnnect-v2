// src/routes/AdminRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
// import Users from "../pages/admin/Users";
import ProtectedRoute from "../hoc/ProtectedRoute";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="dashboard"
        element={
        //   <ProtectedRoute role="admin">
            <Dashboard />
        //   </ProtectedRoute>
        }
      />
      <Route
        path="users"
        element={
          <ProtectedRoute role="admin">
            {/* <Users /> */}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

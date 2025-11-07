// src/routes/StoreRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
// import Dashboard from "../pages/store/Dashboard";
// import Orders from "../pages/store/Orders";
import ProtectedRoute from "../hoc/ProtectedRoute";

export default function StoreRoutes() {
  return (
    <Routes>
      <Route
        path="dashboard"
        element={
          <ProtectedRoute role="store">
            {/* <Dashboard /> */}
          </ProtectedRoute>
        }
      />
      <Route
        path="orders"
        element={
          <ProtectedRoute role="store">
            {/* <Orders /> */}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// src/routes/ClientRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
// import Home from "../pages/client/Home";
// import Profile from "../pages/client/Profile";
import ProtectedRoute from "../hoc/ProtectedRoute";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route
        path="home"
        element={
          <ProtectedRoute role="client">
            {/* <Home /> */}
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute role="client">
            {/* <Profile /> */}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

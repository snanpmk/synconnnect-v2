// src/routes/ClientRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
// import Home from "../pages/client/Home";
// import Profile from "../pages/client/Profile";
import ProtectedRoute from "../hoc/ProtectedRoute";
import Home from "../pages/client/Home";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route
        path="home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={<ProtectedRoute>{/* <Profile /> */}</ProtectedRoute>}
      />
    </Routes>
  );
}

// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import ClientRoutes from "./routes/ClientRoutes";
import StoreRoutes from "./routes/StoreRoutes";

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Client routes */}
        <Route path="/client/*" element={<ClientRoutes />} />

        {/* Store / Merchant routes */}
        <Route path="/store/*" element={<StoreRoutes />} />

        {/* Fallback */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;

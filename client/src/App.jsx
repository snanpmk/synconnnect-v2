// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import ClientRoutes from "./routes/ClientRoutes";
import StoreRoutes from "./routes/StoreRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const queryClient = new QueryClient();
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/admin/*" element={<AdminRoutes />} />

            <Route path="/client/*" element={<ClientRoutes />} />

            <Route path="/store/*" element={<StoreRoutes />} />

            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

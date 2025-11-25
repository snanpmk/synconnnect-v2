// src/routes/ClientRoutes.jsx
import { Route, Routes } from "react-router-dom";
// import Home from "../pages/client/Home";
// import Profile from "../pages/client/Profile";
import ProtectedRoute from "../hoc/ProtectedRoute";
import BusinessProfile from "../pages/client/BusinessProfile";
import ClientDashboard from "../pages/client/ClientDashboard";
import Profile from "../pages/client/Profile";
import SetupScreenBusiness from "../pages/client/setup/SetupScreenBusiness";
import HasProfileSetup from "../hoc/HasProfileSetup";
import LandingMain from "../pages/landing/LandingMain";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route path="profile/:id" element={<Profile />} />
      <Route
        path="business/:id"
        element={
          // <ProtectedRoute>
          <BusinessProfile />
          // </ProtectedRoute>
        }
      />

      <Route path="/" element={<LandingMain />} />
      <Route
        path="setup"
        element={
          <ProtectedRoute>
            <SetupScreenBusiness />
          </ProtectedRoute>
        }
      />
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <HasProfileSetup>
              <ClientDashboard />
            </HasProfileSetup>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

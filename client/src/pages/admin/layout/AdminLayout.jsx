import React, { useState } from "react";
import AdminDashSidebar from "./AdminDashSidebar";
import AdminDashboardHeader from "./AdminDashboardHeader";

const AdminLayout = ({ children }) => {
  const [activeView, setActiveView] = useState("manage-users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to change view and close sidebar on mobile
  const handleViewChange = (view) => {
    setActiveView(view);
    // Use the Tailwind CSS breakpoint convention for closing sidebar on mobile
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar (handles its own backdrop and responsiveness logic) */}
      <AdminDashSidebar
        activeView={activeView}
        handleViewChange={handleViewChange}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header (passes function to toggle sidebar) */}
        <AdminDashboardHeader setIsSidebarOpen={setIsSidebarOpen} />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* {activeView === "manage-users" ? (
            <ManageUsersView />
          ) : (
            <DashboardView />
          )} */}

          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

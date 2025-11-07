import { Users, X } from "lucide-react";

const AdminDashSidebar = ({
  activeView,
  handleViewChange,
  isSidebarOpen,
  setIsSidebarOpen,
}) => (
  <>
    {/* Mobile Backdrop Overlay */}
    {isSidebarOpen && (
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-50 z-30 lg:hidden"
        onClick={() => setIsSidebarOpen(false)}
      />
    )}

    {/* Sidebar Structure */}
    <div
      className={`fixed lg:relative w-64 h-full bg-white border-r border-gray-200 shadow-xl flex flex-col 
                        transition-transform duration-300 ease-in-out z-40 lg:translate-x-0
                        ${
                          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="">
            <span>Synconnect Dashboard</span>
          </div>
        </div>
        {/* Close button for mobile */}
        <button
          className="lg:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* <button
          onClick={() => handleViewChange("dashboard")}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
            activeView === "dashboard"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </button> */}
        <button
          onClick={() => handleViewChange("manage-users")}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
            activeView === "manage-users"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Manage Users</span>
        </button>
      </nav>
    </div>
  </>
);

export default AdminDashSidebar;

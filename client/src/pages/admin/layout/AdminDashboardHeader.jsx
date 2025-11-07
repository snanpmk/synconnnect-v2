import { Bell } from "lucide-react";

const AdminDashboardHeader = ({ setIsSidebarOpen }) => (
  <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shadow-sm z-10">
    <div className="flex items-center space-x-4 flex-1">
      {/* Hamburger button for mobile, hidden on large screens */}
      <button
        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open menu"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <div className="flex items-center space-x-4">
      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative transition-colors">
        <Bell className="w-5 h-5" />
      </button>
     
    </div>
  </div>
);
export default AdminDashboardHeader;

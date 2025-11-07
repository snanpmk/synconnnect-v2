// --- SUB-COMPONENTS ---
import React, { useState } from "react";
import {
  Users,
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Package,
  MoreVertical,
  Plus,
  Search,
  Bell,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MetricCard = ({ title, value, Icon, change, isPositive, svgPath }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
        {Icon ? (
          <Icon className="w-6 h-6 text-indigo-600" />
        ) : (
          <svg
            className="w-6 h-6 text-indigo-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            dangerouslySetInnerHTML={{ __html: svgPath }}
          />
        )}
      </div>
    </div>
    <div className="text-gray-500 text-sm mb-1">{title}</div>
    <div className="flex items-end justify-between">
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div
        className={`flex items-center space-x-1 text-sm font-semibold ${
          isPositive ? "text-emerald-500" : "text-red-500"
        }`}
      >
        {isPositive ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        )}
        <span>{change}</span>
      </div>
    </div>
  </div>
);

const MonthlySalesChart = () => (
  <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold text-gray-900">Monthly Sales</h2>
      <button className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors">
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={monthlySalesData}
          margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#4b5563" fontSize={12} />
          <YAxis stroke="#4b5563" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const GaugeChartComponent = () => {
  // Gauge Chart helper component (kept local as it's highly specialized)
  const GaugeChart = ({ percentage }) => {
    const radius = 90;
    const strokeWidth = 16;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset =
      circumference - (percentage / 100) * (circumference * 0.75);

    return (
      <div className="relative w-64 h-64 mx-auto">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-[135deg]"
        >
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
          />
          <circle
            stroke="url(#gradient)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-gray-900">{percentage}%</div>
          <div className="text-emerald-500 text-sm mt-1 font-medium">+10%</div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Monthly Target
          </h2>
          <p className="text-sm text-gray-500">Goal completion metric</p>
        </div>
        <button className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <GaugeChart percentage={75.55} />
      <p className="text-center text-sm text-gray-600 mt-4">
        You earned **$3287** today, which is higher than last month. Keep up
        your good work!
      </p>
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-2 rounded-lg bg-gray-50">
          <div className="text-xs text-gray-500 mb-1">Target</div>
          <div className="text-lg font-bold text-gray-900 flex items-center justify-center">
            $20K
            <TrendingDown className="w-4 h-4 text-red-500 ml-1" />
          </div>
        </div>
        <div className="text-center p-2 rounded-lg bg-gray-50">
          <div className="text-xs text-gray-500 mb-1">Revenue</div>
          <div className="text-lg font-bold text-gray-900 flex items-center justify-center">
            $18K
            <TrendingUp className="w-4 h-4 text-emerald-500 ml-1" />
          </div>
        </div>
        <div className="text-center p-2 rounded-lg bg-gray-50">
          <div className="text-xs text-gray-500 mb-1">Today</div>
          <div className="text-lg font-bold text-gray-900 flex items-center justify-center">
            $3.2K
            <TrendingUp className="w-4 h-4 text-emerald-500 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatisticsChart = () => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Statistics Overview
        </h2>
        <p className="text-sm text-gray-500">
          Comparing user engagement and bounce rate
        </p>
      </div>
      <div className="flex space-x-2 mt-3 sm:mt-0">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium shadow-md">
          Monthly
        </button>
        <button className="px-4 py-2 hover:bg-gray-100 text-gray-600 rounded-xl text-sm font-medium transition-colors">
          Quarterly
        </button>
        <button className="px-4 py-2 hover:bg-gray-100 text-gray-600 rounded-xl text-sm font-medium transition-colors">
          Annually
        </button>
      </div>
    </div>
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={statisticsData}
          margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#4b5563" fontSize={12} />
          <YAxis stroke="#4b5563" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="series1"
            name="Engagement"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="series2"
            name="Bounce Rate"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const ManageUsersView = () => (
  <div>
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-3 sm:space-y-0">
      <button className="flex items-center justify-center sm:justify-start space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-colors shadow-lg w-full sm:w-auto">
        <Plus className="w-5 h-5" />
        <span>Add User</span>
      </button>
    </div>

    {/* Users Table */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usersData.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-indigo-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      user.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-indigo-600 hover:text-indigo-800 mr-3 font-medium transition-colors">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800 font-medium transition-colors">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const DashboardView = () => (
  <div className="space-y-6">
    {/* Key Metrics - Responsive Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Customers"
        value="3,782"
        Icon={Users}
        change="11.01%"
        isPositive={true}
      />
      <MetricCard
        title="Orders"
        value="5,359"
        Icon={Package}
        change="9.05%"
        isPositive={false}
      />
      <MetricCard
        title="Revenue"
        value="$12,450"
        Icon={null}
        svgPath='<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'
        change="5.3%"
        isPositive={true}
      />
      <MetricCard
        title="Products"
        value="1,024"
        Icon={null}
        svgPath='<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M22 10h-4M18 10h-4M14 10h-4"/>'
        change="2.1%"
        isPositive={false}
      />
    </div>

    {/* Charts Row - Responsive Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <MonthlySalesChart />
      <GaugeChartComponent />
    </div>

    {/* Statistics (Line Chart) */}
    <StatisticsChart />
  </div>
);

// --- MAIN COMPONENT ---

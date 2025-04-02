import { useState } from "react";
import DashboardOverview from "./DashboardOverview";
import UserManagement from "./UserManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* Tabs for switching views */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 rounded ${activeTab === "dashboard" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
        >
          Manage Users
        </button>
      </div>

      {/* Load Components Based on Active Tab */}
      {activeTab === "dashboard" ? <DashboardOverview /> : <UserManagement />}
    </div>
  );
};

export default AdminDashboard;

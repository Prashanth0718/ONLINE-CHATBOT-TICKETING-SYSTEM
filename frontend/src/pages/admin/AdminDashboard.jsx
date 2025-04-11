import { useState } from "react";
import DashboardOverview from "./DashboardOverview";
import UserManagement from "./UserManagement";
import ManageMuseums from "./ManageMuseums";
import ManageTickets from "./ManageTickets";
import ManagePayments from "./ManagePayments";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard", component: <DashboardOverview /> },
    { id: "users", label: "Manage Users", component: <UserManagement /> },
    { id: "museums", label: "Manage Museums", component: <ManageMuseums /> },
    { id: "tickets", label: "Manage Tickets", component: <ManageTickets /> },
    { id: "payments", label: "Manage Payments", component: <ManagePayments /> },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto space-x-4 mb-4 bg-gray-100 p-2 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded transition duration-300 ${
              activeTab === tab.id
                ? "bg-blue-600 text-white font-bold"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="p-4 bg-white shadow-md rounded-lg">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default AdminDashboard;

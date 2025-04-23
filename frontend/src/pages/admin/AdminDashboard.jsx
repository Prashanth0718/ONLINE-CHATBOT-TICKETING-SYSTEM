import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardOverview from "./DashboardOverview";
import UserManagement from "./UserManagement";
import ManageMuseums from "./ManageMuseums";
import ManageTickets from "./ManageTickets";
import ManagePayments from "./ManagePayments";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "📊 Dashboard", component: <DashboardOverview /> },
    { id: "users", label: "👥 Manage Users", component: <UserManagement /> },
    { id: "museums", label: "🏛️ Manage Museums", component: <ManageMuseums /> },
    { id: "tickets", label: "🎫 Manage Tickets", component: <ManageTickets /> },
    { id: "payments", label: "💳 Manage Payments", component: <ManagePayments /> },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-800 drop-shadow-lg">
        Admin Dashboard
      </h2>

      {/* Tab Navigation */}
      <div className="flex justify-center flex-wrap gap-4 mb-6 bg-white/30 backdrop-blur-md p-4 rounded-2xl shadow-inner border border-white">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 shadow-md 
              ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white scale-105"
                  : "bg-white text-blue-700 hover:bg-blue-100"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content with Animation */}
      <div className="bg-white rounded-3xl shadow-2xl p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
          >
            {activeTabData?.component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;

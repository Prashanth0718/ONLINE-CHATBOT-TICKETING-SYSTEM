import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from "chart.js";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart as ChartBar, Users, Building2, CreditCard, MessageSquare, Loader } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const DashboardOverview = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendURL}/api/analytics/admin-dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data || {
        totalBookings: 0,
        ticketBookings: 0,
        totalRevenue: 0,
        chatbotQueries: 0,
        museumBookings: {},
      };

      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const chartData = analytics && analytics.museumBookings
    ? {
        labels: Object.keys(analytics.museumBookings),
        datasets: [{
          label: "Museum Bookings",
          data: Object.values(analytics.museumBookings),
          backgroundColor: "rgba(79, 70, 229, 0.6)",
          borderColor: "rgba(79, 70, 229, 1)",
          borderWidth: 1,
          borderRadius: 8,
          hoverBackgroundColor: "rgba(99, 102, 241, 0.8)",
        }],
      }
    : { labels: [], datasets: [] };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1F2937",
        bodyColor: "#4F46E5",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
      y: {
        grid: {
          color: "rgba(243, 244, 246, 1)",
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeOutQuart",
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-700">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Dashboard
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Overview
            </span>
          </h1>
          <p className="mt-3 text-lg text-gray-600">Monitor your museum's performance and analytics</p>
        </motion.div>

        <AnimatePresence>
          {error ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-center"
            >
              {error}
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 font-medium">Total Bookings</p>
                    <h3 className="text-3xl font-bold mt-2">{analytics?.totalBookings || 0}</h3>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 font-medium">Total Revenue</p>
                    <h3 className="text-3xl font-bold mt-2">
                      ₹{analytics?.totalRevenue?.toFixed(2) || "0.00"}
                    </h3>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 font-medium">Active Museums</p>
                    <h3 className="text-3xl font-bold mt-2">
                      {Object.keys(analytics?.museumBookings || {}).length}
                    </h3>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 font-medium">Chatbot Queries</p>
                    <h3 className="text-3xl font-bold mt-2">{analytics?.chatbotQueries || 0}</h3>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Museum Bookings Overview</h2>
            <ChartBar className="w-6 h-6 text-blue-600" />
          </div>
          <div className="h-[400px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Booking Trends</h2>
            <ChartBar className="w-6 h-6 text-blue-600" />
          </div>
          <div className="h-[400px]">
            <Line
              data={{
                ...chartData,
                datasets: [{
                  ...chartData.datasets[0],
                  borderColor: "rgba(79, 70, 229, 1)",
                  backgroundColor: "rgba(79, 70, 229, 0.1)",
                  fill: true,
                  tension: 0.4,
                }]
              }}
              options={chartOptions}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
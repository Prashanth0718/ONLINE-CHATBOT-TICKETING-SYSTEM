import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardOverview = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://museumgo-backend.onrender.com/api/analytics/admin-dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📊 API Response:", response.data);

      // Ensure valid response
      const data = response.data || {
        totalBookings: 0,
        ticketBookings: 0,
        totalRevenue: 0,
        chatbotQueries: 0,
        museumBookings: {},
      };

      setAnalytics(data);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching analytics:", error);
      setLoading(false);
      setError("Failed to load analytics.");
    }
  };

  // const chartData = analytics
  //   ? {
  //       labels: Object.keys(analytics.museumBookings),
  //       datasets: [
  //         {
  //           label: "Museum Bookings",
  //           data: Object.values(analytics.museumBookings),
  //           backgroundColor: "rgba(54, 162, 235, 0.6)",
  //           borderColor: "rgba(54, 162, 235, 1)",
  //           borderWidth: 1,
  //         },
  //       ],
  //     }
  //   : null;

    const chartData = analytics && analytics.museumBookings
    ? {
        labels: Object.keys(analytics.museumBookings),
        datasets: [
          {
            label: "Museum Bookings",
            data: Object.values(analytics.museumBookings),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      }
    : { labels: [], datasets: [] }; 

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white shadow-xl rounded-lg max-w-7xl mx-auto"
    >
      <h3 className="text-3xl font-semibold text-center text-blue-700 mb-8">Dashboard Overview</h3>

      {loading ? (
        <p className="text-center text-gray-500">Loading analytics...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : analytics ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Total Bookings */}
            <motion.div
              className="bg-blue-500 p-6 rounded-lg shadow-xl text-white text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h4 className="text-xl font-semibold">Total Bookings</h4>
              <p className="text-3xl font-bold">{analytics.totalBookings}</p>
            </motion.div>

            {/* Total Revenue */}
            <motion.div
              className="bg-green-500 p-6 rounded-lg shadow-xl text-white text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h4 className="text-xl font-semibold">Total Revenue</h4>
              <p className="text-3xl font-bold">
              ₹{analytics.totalRevenue ? analytics.totalRevenue.toFixed(2) : "0.00"}
              </p>
            </motion.div>

            {/* Chatbot Queries */}
            <motion.div
              className="bg-yellow-500 p-6 rounded-lg shadow-xl text-white text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h4 className="text-xl font-semibold">Chatbot Queries</h4>
              <p className="text-3xl font-bold">{analytics.chatbotQueries}</p>
            </motion.div>
          </div>

          {/* Museum Bookings Chart */}
          <div className="mb-8">
            <h4 className="text-xl font-semibold text-gray-700 mb-4">Museum Bookings</h4>
            <motion.div
              className="w-full bg-gray-50 rounded-lg p-6 shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  aspectRatio: 2,
                  plugins: {
                    legend: { display: false },
                    title: {
                      display: true,
                      text: "Museum Ticket Sales",
                      font: { size: 16 },
                    },
                  },
                  scales: {
                    x: { grid: { display: false } },
                    y: { grid: { display: true } },
                  },
                }}
              />
            </motion.div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No analytics data available.</p>
      )}
    </motion.div>
  );
};

export default DashboardOverview;
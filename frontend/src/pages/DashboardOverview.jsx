import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardOverview = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/analytics/admin-dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = response.data;
      if (Array.isArray(data)) {
        data = data.reduce((acc, curr) => {
          acc.totalBookings += curr.totalBookings || 0;
          acc.totalRevenue += curr.totalRevenue || 0;
          acc.chatbotQueries += curr.chatbotQueries || 0;

          Object.keys(curr.museumBookings || {}).forEach((museum) => {
            acc.museumBookings[museum] = (acc.museumBookings[museum] || 0) + curr.museumBookings[museum];
          });

          return acc;
        }, {
          totalBookings: 0,
          totalRevenue: 0,
          chatbotQueries: 0,
          museumBookings: {}
        });
      }

      // Sort museum bookings (highest first)
      data.museumBookings = Object.fromEntries(
        Object.entries(data.museumBookings).sort((a, b) => b[1] - a[1])
      );

      setAnalytics(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setLoading(false);
    }
  };

  const chartData = analytics
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
    : null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Overview</h3>
      {loading ? (
        <p>Loading analytics...</p>
      ) : analytics ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-blue-800">Total Bookings</h4>
              <p className="text-2xl font-bold">{analytics.totalBookings}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-green-800">Total Revenue</h4>
              <p className="text-2xl font-bold">${analytics.totalRevenue}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-yellow-800">Chatbot Queries</h4>
              <p className="text-2xl font-bold">{analytics.chatbotQueries}</p>
            </div>
          </div>

          <h4 className="text-lg font-semibold mt-6">Museum Bookings</h4>
          <div className="mt-6 w-full md:w-2/3 lg:w-1/2">
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        </div>
      ) : (
        <p>No analytics data available.</p>
      )}
    </div>
  );
};

export default DashboardOverview;

import { useEffect, useState } from "react";
import axios from "axios";
import AnalyticsChart from "../components/AnalyticsChart";

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [museum, setMuseum] = useState("");
    
    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      
      try {
          const params = {};
          if (startDate && endDate) {
              params.startDate = startDate;
              params.endDate = endDate;
          }
          if (museum) params.museum = museum;
  
          const response = await axios.get("http://localhost:5000/api/analytics", { params });
  
          if (response.data.data.analytics.length === 0) {
              setError("No analytics data available for the selected range.");
          } else {
              setAnalytics(response.data.data);
          }
      } catch (err) {
          setError("Failed to load analytics data.");
      } finally {
          setLoading(false);
      }
  };
  

    if (loading) return <p>Loading analytics...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            {/* 🎯 Filters */}
            <div className="flex space-x-4 mb-6">
                <div>
                    <label className="block text-sm font-medium">Start Date:</label>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">End Date:</label>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Museum:</label>
                    <select 
                        value={museum} 
                        onChange={(e) => setMuseum(e.target.value)}
                        className="border p-2 rounded w-full"
                    >
                        <option value="">All</option>
                        <option value="Louvre">Louvre</option>
                        <option value="British Museum">British Museum</option>
                        <option value="Metropolitan Museum">Metropolitan Museum</option>
                    </select>
                </div>
                <button 
                    onClick={fetchAnalytics} 
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-6"
                >
                    Apply Filters
                </button>
            </div>

            {/* 📊 Charts */}
            <AnalyticsChart analytics={analytics} />

            {/* 📊 Other Analytics Data */}
            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white p-4 shadow-md rounded">
                    <h2 className="text-lg font-semibold">Total Bookings</h2>
                    <p className="text-xl">{analytics.analytics.reduce((sum, a) => sum + a.totalBookings, 0)}</p>
                </div>
                <div className="bg-white p-4 shadow-md rounded">
                    <h2 className="text-lg font-semibold">Ticket Bookings</h2>
                    <p className="text-xl">{analytics.analytics.reduce((sum, a) => sum + a.ticketBookings, 0)}</p>
                </div>
                <div className="bg-white p-4 shadow-md rounded">
                    <h2 className="text-lg font-semibold">Total Revenue</h2>
                    <p className="text-xl">${analytics.analytics.reduce((sum, a) => sum + a.totalRevenue, 0)}</p>
                </div>
                <div className="bg-white p-4 shadow-md rounded">
                    <h2 className="text-lg font-semibold">Chatbot Queries</h2>
                    <p className="text-xl">{analytics.analytics.reduce((sum, a) => sum + a.chatbotQueries, 0)}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

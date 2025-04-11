import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const AnalyticsChart = ({ analytics }) => {
    if (!analytics) return null;

    const monthlyStats = analytics.monthlyStats || [];

    // 📊 Bar Chart for Bookings & Chatbot Queries
    const barData = {
        labels: ["Total Bookings", "Ticket Bookings", "Chatbot Queries"],
        datasets: [
            {
                label: "Analytics Data",
                data: [analytics.totalBookings, analytics.ticketBookings, analytics.chatbotQueries],
                backgroundColor: ["#4CAF50", "#FF9800", "#2196F3"],
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Booking & Chatbot Analytics" },
        },
    };

    // 📈 Line Chart for Revenue Trends
    const revenueData = {
        labels: monthlyStats.map((stat) => stat.month),
        datasets: [
            {
                label: "Total Revenue (₹)",
                data: monthlyStats.map((stat) => stat.revenue),
                borderColor: "#FF5733",
                backgroundColor: "rgba(255, 87, 51, 0.2)",
                tension: 0.3,
            },
        ],
    };

    // 📈 Line Chart for Ticket Sales Trends
    const ticketData = {
        labels: monthlyStats.map((stat) => stat.month),
        datasets: [
            {
                label: "Tickets Sold",
                data: monthlyStats.map((stat) => stat.tickets),
                borderColor: "#2196F3",
                backgroundColor: "rgba(33, 150, 243, 0.2)",
                tension: 0.3,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Trends Over Time" },
        },
    };

    return (
        <div className="space-y-6">
            {/* 📊 Bar Chart for Bookings & Chatbot */}
            <div className="bg-white p-4 shadow-md rounded">
                <Bar data={barData} options={barOptions} />
            </div>

            {/* 📈 Line Chart for Revenue */}
            <div className="bg-white p-4 shadow-md rounded">
                <Line data={revenueData} options={lineOptions} />
            </div>

            {/* 📈 Line Chart for Ticket Sales */}
            <div className="bg-white p-4 shadow-md rounded">
                <Line data={ticketData} options={lineOptions} />
            </div>
        </div>
    );
};

export default AnalyticsChart;

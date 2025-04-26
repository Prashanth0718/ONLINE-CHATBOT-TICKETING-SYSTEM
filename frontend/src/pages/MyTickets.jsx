import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Download, Ban, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "My Tickets - MuseumGo";

    const fetchTickets = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found. User may be logged out.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/tickets/my-tickets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(res.data);
      } catch (error) {
        console.error("❌ Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const formatDate = (dateString) => format(new Date(dateString), "MMM dd, yyyy");

  const downloadTicket = (ticket) => {
    const ticketData = `
      🎟️ Ticket Details:
      ------------------
      Ticket ID: ${ticket._id}
      Museum: ${ticket.museumName}
      Date: ${formatDate(ticket.date)}
      Price: $${ticket.price}
      Status: ${ticket.status}
    `;

    const blob = new Blob([ticketData], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ticket_${ticket._id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cancelTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to cancel this ticket?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ You are not logged in. Please log in again.");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/tickets/cancel/${ticketId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? { ...t, status: "cancelled" } : t))
      );

      alert("✅ Ticket cancelled successfully! Refund is being processed.");
    } catch (error) {
      console.error("❌ Error cancelling ticket:", error.response?.data || error.message);
      alert("⚠️ Failed to cancel ticket.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          My Tickets
        </h1>

        {tickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16 bg-white rounded-2xl shadow-lg"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <p className="text-xl text-gray-600">You haven't booked any tickets yet.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => {
              const now = new Date();
              const ticketDate = new Date(ticket.date);
              ticketDate.setHours(23, 59, 59, 999);
              const isExpired = ticketDate < now && ticket.status === "booked";

              return (
                <motion.div
                  key={ticket._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{ticket.museumName}</h2>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        ticket.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : isExpired
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {ticket.status === "cancelled" ? (
                        <Ban className="w-4 h-4 mr-1" />
                      ) : isExpired ? (
                        <Clock className="w-4 h-4 mr-1" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      )}
                      {ticket.status === "cancelled"
                        ? "Cancelled"
                        : isExpired
                        ? "Expired"
                        : "Active"}
                    </span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <p className="text-gray-600">Date: {formatDate(ticket.date)}</p>
                    <p className="text-gray-600">Price: ${ticket.price}</p>
                  </div>

                  <div className="flex justify-between gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => downloadTicket(ticket)}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </motion.button>

                    {!isExpired && ticket.status !== "cancelled" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => cancelTicket(ticket._id)}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        Cancel
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MyTickets;
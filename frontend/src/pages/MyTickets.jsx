import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import Loader from "../components/Loader"; // 🌀 Loader Component

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "My Tickets - TicketBooking"; // Dynamic Page Title

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

  const formatDate = (dateString) => format(new Date(dateString), "MMM dd, yyyy"); // 📅 Elegant Date Format

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
  
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 md:px-12">
      
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-wide">
        🎟️ My Tickets
      </h1>
      
      

      {loading ? (
        <Loader /> // 🌀 Fancy Loader
      ) : tickets.length === 0 ? (
        <div className="text-center text-gray-600 mt-16">
          <i className="fas fa-ticket-alt text-6xl text-gray-400"></i>
          <p className="mt-4 text-lg">You haven’t booked any tickets yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => {
            // 🕒 Check if the ticket is expired
          const now = new Date();
          const ticketDate = new Date(ticket.date);
          ticketDate.setHours(23, 59, 59, 999);
          const isExpired = ticketDate < now && ticket.status === "booked";
          

          return (
            <div
              key={ticket._id}
              className="bg-white bg-opacity-90 shadow-lg rounded-xl p-6 border border-gray-300 transition transform hover:scale-105 hover:shadow-2xl"
            >
              <h2 className="text-xl font-semibold text-gray-800">{ticket.museumName}</h2>
              <p className="text-gray-600">📅 Date: {formatDate(ticket.date)}</p>
              <p className="text-gray-600">💰 Price: <span className="font-medium">${ticket.price}</span></p>

              <span
                className={`inline-block px-3 py-1 mt-2 text-sm font-semibold rounded-full ${
                  ticket.status === "cancelled"
                    ? "bg-red-500 text-white"
                    : isExpired
                      ? "bg-yellow-500 text-white"
                      : "bg-green-500 text-white"
                }`}
                title={
                  ticket.status === "cancelled"
                    ? "This ticket has been cancelled."
                    : isExpired
                      ? "This ticket has expired."
                      : "This ticket is active."
                }
              >
                {ticket.status === "cancelled"
                  ? "🚫 Cancelled"
                  : isExpired
                  ? "⌛ Expired"
                  : "✅ Active"}
              </span>

              <div className="flex justify-between mt-5">
                <button
                  onClick={() => downloadTicket(ticket)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:scale-105 transition transform"
                >
                  📥 Download
                </button>

                <button
                  onClick={() => cancelTicket(ticket._id)}
                  disabled={ticket.status === "cancelled" || isExpired}
                  className={`px-4 py-2 font-medium rounded-lg shadow-md transition transform ${
                    ticket.status === "cancelled" || isExpired
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:scale-105"
                  }`}
                >
                  {ticket.status === "cancelled"
                    ? "🚫 Cancelled"
                    : isExpired
                    ? "⌛ Expired"
                    : "❌ Cancel"}
                </button>
              </div>
            </div>
          );
        })}

        </div>
      )}
    </div>
  );
};

export default MyTickets;

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem("token");
      console.log("🔑 Stored Token:", token);

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
  }, []); // ✅ Only runs on mount (no `token` dependency)

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MM/dd/yyyy"); // Always MM/DD/YYYY format
  };

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

  const cancelTicket = async (ticketId, token) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this ticket?");
    if (!confirmCancel) return;

    console.log("🚀 Sending Token:", token); // Debugging line

    if (!token) {
      alert("You are not logged in. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/tickets/cancel/${ticketId}`,
        {}, // Empty body (if needed)
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Ticket cancellation response:", response.data);

      // ✅ Update ticket status to "canceled" instead of removing it
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === ticketId ? { ...ticket, status: "canceled" } : ticket
        )
      );

      alert("✅ Ticket canceled successfully! Refund is being processed.");
    } catch (error) {
      console.error("❌ Error canceling ticket:", error.response?.data || error.message);
      alert("⚠️ Failed to cancel ticket.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">🎟️ My Tickets</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : tickets.length === 0 ? (
        <p className="text-center text-gray-600">No tickets booked yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="bg-white shadow-md p-4 rounded-lg border">
              <h2 className="text-lg font-semibold">Museum: {ticket.museumName}</h2>
              <p>Date: {format(new Date(ticket.date), "MM/dd/yyyy")}</p>
              <p>Price: ${ticket.price}</p>
              <p>Status: {ticket.status}</p>

              <div className="flex justify-between mt-3">
                <button
                  onClick={() => downloadTicket(ticket)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                  📥 Download
                </button>

                <button
                  onClick={() => cancelTicket(ticket._id, localStorage.getItem("token"))} // ✅ Pass token here
                  disabled={ticket.status === "canceled"}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition disabled:bg-gray-400"
                >
                  {ticket.status === "canceled" ? "🚫 Canceled" : "❌ Cancel"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;

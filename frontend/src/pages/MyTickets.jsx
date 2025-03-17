import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTickets = async () => {
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
  }, [token]);

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

  const cancelTicket = async (ticketId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this ticket?");
    if (!confirmCancel) return;

    try {
      await axios.delete(`http://localhost:5000/api/tickets/cancel/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTickets((prevTickets) => prevTickets.filter((ticket) => ticket._id !== ticketId));
      alert("Ticket canceled successfully!");
    } catch (error) {
      console.error("❌ Error canceling ticket:", error);
      alert("Failed to cancel ticket.");
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
                  onClick={() => cancelTicket(ticket._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  ❌ Cancel
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

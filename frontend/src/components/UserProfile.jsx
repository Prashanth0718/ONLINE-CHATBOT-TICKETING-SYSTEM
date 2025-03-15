import { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [ticketHistory, setTicketHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ticketRes = await axios.get("http://localhost:5000/api/tickets/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userRes.data);
        setTicketHistory(ticketRes.data);
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">👤 User Profile</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <div>
          {/* User Profile Information */}
          <div className="bg-white shadow-md p-6 rounded-lg border mb-6">
            <h2 className="text-2xl font-semibold">User Information</h2>
            <p className="mt-4"><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
          </div>

          {/* Ticket History */}
          <div className="bg-white shadow-md p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold">Ticket History</h2>
            {ticketHistory.length > 0 ? (
              <ul className="mt-4">
                {ticketHistory.map((ticket) => (
                  <li key={ticket._id} className="border-b py-4">
                    <h3 className="text-xl font-semibold">Museum: {ticket.museumName}</h3>
                    <p>Date: {new Date(ticket.date).toLocaleDateString()}</p>
                    <p>Price: ${ticket.price}</p>
                    <p>Status: {ticket.status}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No tickets found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

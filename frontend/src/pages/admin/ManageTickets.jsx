import { useEffect, useState } from "react";
import axios from "axios";

const ManageTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Unauthorized: Please log in as Admin.");
                return;
            }

            const response = await axios.get("http://localhost:5000/api/tickets/all", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            setTickets(response.data);
        } catch (error) {
            setError(error.response?.data?.error || "Failed to load tickets");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
    
            await axios.delete(`http://localhost:5000/api/admin/bookings/${id}`, {
                headers: { 
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true,
            });
    
            setTickets(tickets.filter(ticket => ticket._id !== id));
    
            alert("Ticket deleted successfully!");
        } catch (error) {
            console.error("Error deleting ticket:", error.response?.data || error);
            alert("Error deleting ticket!");
        }
    };
    

    const handleUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem("token");
    
            const response = await axios.put(
                `http://localhost:5000/api/tickets/${id}`,
                { status: newStatus },
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json" 
                    },
                    withCredentials: true,
                }
            );
    
            setTickets(tickets.map(ticket => 
                ticket._id === id ? { ...ticket, status: newStatus } : ticket
            ));
    
            alert("Ticket updated successfully!");
        } catch (error) {
            console.error("Error updating ticket:", error.response?.data || error);
            alert("Error updating ticket!");
        }
    };
    
    

    if (loading) return <p>Loading tickets...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Manage Tickets</h2>
            <table className="min-w-full bg-white border border-gray-300">
            <thead>
            <tr className="bg-gray-200">
                <th className="border px-4 py-2">User</th>
                <th className="border px-4 py-2">Museum</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
            </tr>
            </thead>
            <tbody>
            {tickets.map((ticket) => (
                <tr key={ticket._id}>
                <td className="border px-4 py-2">
                    {ticket.userId?.name || "Unknown"}
                </td>
                <td className="border px-4 py-2">{ticket.museumName}</td>
                <td className="border px-4 py-2">
                    {new Date(ticket.date).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">{ticket.status}</td>
                <td className="border px-4 py-2">
                    <button
                    className="bg-blue-500 text-white px-3 py-1 mr-2"
                    onClick={() =>
                        handleUpdate(
                        ticket._id,
                        ticket.status === "booked" ? "cancelled" : "booked"
                        )
                    }
                    >
                    {ticket.status === "booked" ? "Cancel" : "Rebook"}
                    </button>
                    <button
                    className="bg-red-500 text-white px-3 py-1"
                    onClick={() => handleDelete(ticket._id)}
                    >
                    Delete
                    </button>
                </td>
                </tr>
            ))}
            </tbody>


            </table>
        </div>
    );
};

export default ManageTickets;

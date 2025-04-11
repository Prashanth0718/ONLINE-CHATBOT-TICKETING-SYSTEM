import { useEffect, useState } from "react";
import axios from "axios";

const ManageMuseums = () => {
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", location: "", ticketPrice: "", availableTickets: "" });
  const [editingMuseum, setEditingMuseum] = useState(null);

  useEffect(() => {
    fetchMuseums();
  }, []);

  // Fetch all museums
  const fetchMuseums = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/museums", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMuseums(response.data);
    } catch (err) {
      setError("Failed to fetch museums.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or update a museum
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingMuseum) {
        // Update museum
        await axios.put(
          `http://localhost:5000/api/museums/${editingMuseum._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Add new museum
        await axios.post("http://localhost:5000/api/museums", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }  
      fetchMuseums(); // Refresh list
      setFormData({ name: "", location: "", ticketPrice: "", availableTickets: "" });
      setEditingMuseum(null);
    } catch (err) {
      setError("Failed to save museum.");
    }
  };

  // Delete a museum
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this museum?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/museums/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMuseums();
    } catch (err) {
      setError("Failed to delete museum.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Museums</h2>

      {/* Form for Adding / Editing Museum */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          name="name"
          placeholder="Museum Name"
          value={formData.name}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          required
        />
        <input
          type="number"
          name="ticketPrice"
          placeholder="Ticket Price (₹)"
          value={formData.ticketPrice}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          required
        />
        <input
          type="number"
          name="availableTickets"
          placeholder="Available Tickets"
          value={formData.availableTickets}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded w-full"
        >
          {editingMuseum ? "Update Museum" : "Add Museum"}
        </button>
      </form>

      {/* Error Message */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Museums List */}
      {loading ? (
        <p>Loading museums...</p>
      ) : (
        <ul className="space-y-4">
          {museums.map((museum) => (
            <li key={museum._id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <p className="font-semibold">{museum.name}</p>
                <p className="text-sm text-gray-600">{museum.location}</p>
                <p className="text-sm">🎟 Ticket Price: ₹{museum.ticketPrice}</p>
                <p className="text-sm">🛒 Available Tickets: {museum.availableTickets}</p>
              </div>
              <div>
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded mr-2"
                  onClick={() => {
                    setEditingMuseum(museum);
                    setFormData({ 
                      name: museum.name, 
                      location: museum.location, 
                      ticketPrice: museum.ticketPrice, 
                      availableTickets: museum.availableTickets 
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(museum._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageMuseums;

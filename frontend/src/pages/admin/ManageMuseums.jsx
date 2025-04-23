import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const ManageMuseums = () => {
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", location: "", ticketPrice: "", availableTickets: "" });
  const [editingMuseum, setEditingMuseum] = useState(null);

  useEffect(() => {
    fetchMuseums();
  }, []);

  const fetchMuseums = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/museums", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMuseums(response.data);
    } catch {
      setError("Failed to fetch museums.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingMuseum) {
        await axios.put(`http://localhost:5000/api/museums/${editingMuseum._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:5000/api/museums", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchMuseums();
      setFormData({ name: "", location: "", ticketPrice: "", availableTickets: "" });
      setEditingMuseum(null);
    } catch {
      setError("Failed to save museum.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this museum?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/museums/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMuseums();
    } catch {
      setError("Failed to delete museum.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">🏛️ Manage Museums</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="glassmorphic p-6 rounded-2xl shadow-lg mb-8 space-y-4 backdrop-blur-md bg-white/70"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Museum Name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="number"
            name="ticketPrice"
            placeholder="Ticket Price (₹)"
            value={formData.ticketPrice}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="number"
            name="availableTickets"
            placeholder="Available Tickets"
            value={formData.availableTickets}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-[1.02] transition"
        >
          {editingMuseum ? "Update Museum" : "Add Museum"}
        </button>
      </form>

      {/* Error */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Museums List */}
      {loading ? (
        <p className="text-gray-500">Loading museums...</p>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {museums.map((museum) => (
              <motion.div
                key={museum._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white shadow-lg rounded-xl p-5 flex justify-between items-start border border-gray-200"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{museum.name}</h3>
                  <p className="text-sm text-gray-600">{museum.location}</p>
                  <p className="text-sm mt-1">🎟️ ₹{museum.ticketPrice}</p>
                  <p className="text-sm">🎫 {museum.availableTickets} Tickets</p>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    onClick={() => {
                      setEditingMuseum(museum);
                      setFormData({
                        name: museum.name,
                        location: museum.location,
                        ticketPrice: museum.ticketPrice,
                        availableTickets: museum.availableTickets,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={() => handleDelete(museum._id)}
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ManageMuseums;

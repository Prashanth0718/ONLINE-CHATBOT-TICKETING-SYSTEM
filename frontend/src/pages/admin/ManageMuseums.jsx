import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Building, MapPin, Ticket, Plus, Edit2, Trash2, Save, X, Loader } from 'lucide-react';

const ManageMuseums = () => {
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", location: "", ticketPrice: "", availableTickets: "" });
  const [editingMuseum, setEditingMuseum] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      setError("Failed to delete museum.");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8"
    >
      <motion.div variants={itemVariants} className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Museum Management
            <span className="block text-lg font-medium text-gray-600">Add and manage museum listings</span>
          </h1>
          <Building className="w-8 h-8 text-blue-600" />
        </div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Museum Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter museum name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    placeholder="Enter location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Price (₹)</label>
                <div className="relative">
                  <Ticket className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    name="ticketPrice"
                    placeholder="Enter ticket price"
                    value={formData.ticketPrice}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Tickets</label>
                <div className="relative">
                  <Ticket className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    name="availableTickets"
                    placeholder="Enter available tickets"
                    value={formData.availableTickets}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              {editingMuseum ? (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Update Museum
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Add Museum
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-700 p-4 rounded-xl mb-6"
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {museums.map((museum) => (
                <motion.div
                  key={museum._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{museum.name}</h3>
                      <div className="space-y-2">
                        <p className="text-gray-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                          {museum.location}
                        </p>
                        <p className="text-gray-600 flex items-center">
                          <Ticket className="w-4 h-4 mr-2 text-blue-600" />
                          ₹{museum.ticketPrice}
                        </p>
                        <p className="text-gray-600 flex items-center">
                          <Ticket className="w-4 h-4 mr-2 text-blue-600" />
                          {museum.availableTickets} tickets available
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditingMuseum(museum);
                        setFormData({
                          name: museum.name,
                          location: museum.location,
                          ticketPrice: museum.ticketPrice,
                          availableTickets: museum.availableTickets,
                        });
                      }}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(museum._id)}
                      className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ManageMuseums;
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Building, MapPin, Ticket, Plus, Edit2, Trash2, Save, X, Loader, Calendar, Users } from 'lucide-react';

const ManageMuseums = () => {
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", location: "", ticketPrice: "", availableTickets: "" });
  const [editingMuseum, setEditingMuseum] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedMuseum, setSelectedMuseum] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [statsFormData, setStatsFormData] = useState({
    date: "",
    availableTickets: "",
    bookedTickets: ""
  });
  const [editingStatId, setEditingStatId] = useState(null);

  const today = new Date().toISOString().split('T')[0];

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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  useEffect(() => {
    fetchMuseums();
  }, []);

  const fetchMuseums = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendURL}/api/museums`, {
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

  const handleStatsChange = (e) => {
    setStatsFormData({ ...statsFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingMuseum) {
        await axios.put(`${backendURL}/api/museums/${editingMuseum._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${backendURL}/api/museums`, formData, {
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

  const handleStatsSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingStatId) {
        await axios.put(
          `${backendURL}/api/museums/${selectedMuseum._id}/stats/${editingStatId}`,
          statsFormData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${backendURL}/api/museums/${selectedMuseum._id}/stats`,
          statsFormData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchMuseums();
      setShowStatsModal(false);
      setStatsFormData({ date: "", availableTickets: "", bookedTickets: "" });
      setEditingStatId(null);
    } catch (error) {
      setError("Failed to update daily stats.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this museum?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendURL}/api/museums/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMuseums();
    } catch (error) {
      setError("Failed to delete museum.");
    }
  };

  const handleDeleteStat = async (museumId, statId) => {
    if (!window.confirm("Are you sure you want to delete this statistic?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendURL}/api/museums/${museumId}/stats/${statId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMuseums();
    } catch (error) {
      setError("Failed to delete statistic.");
    }
  };

  const openStatsModal = (museum, stat = null) => {
    setSelectedMuseum(museum);
    if (stat) {
      setEditingStatId(stat._id);
      setStatsFormData({
        date: new Date(stat.date).toISOString().split('T')[0],
        availableTickets: stat.availableTickets,
        bookedTickets: stat.bookedTickets
      });
    } else {
      setEditingStatId(null);
      setStatsFormData({ date: "", availableTickets: "", bookedTickets: "" });
    }
    setShowStatsModal(true);
  };

  const isDateDisabled = (date) => {
    return new Date(date) < new Date(today);
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

                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-700 mb-2">Daily Statistics</h4>
                        {museum.dailyStats?.map((stat) => (
                          <motion.div 
                            key={stat._id} 
                            className="bg-gray-50 p-3 rounded-lg mb-2 hover:bg-gray-100 transition-colors"
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-600">{new Date(stat.date).toLocaleDateString()}</p>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => openStatsModal(museum, stat)}
                                  className="text-blue-500 hover:text-blue-700"
                                  disabled={isDateDisabled(stat.date)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteStat(museum._id, stat._id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                              <p className="text-sm text-gray-600">Available: {stat.availableTickets}</p>
                              <p className="text-sm text-gray-600">Booked: {stat.bookedTickets}</p>
                            </div>
                          </motion.div>
                        ))}
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
                      onClick={() => openStatsModal(museum)}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Add Stats
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

      <AnimatePresence>
        {showStatsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingStatId ? 'Edit Daily Statistics' : 'Add Daily Statistics'}
                </h3>
                <button
                  onClick={() => {
                    setShowStatsModal(false);
                    setEditingStatId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleStatsSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={statsFormData.date}
                    onChange={handleStatsChange}
                    min={today}
                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      editingStatId && isDateDisabled(statsFormData.date) ? 'bg-gray-100' : ''
                    }`}
                    required
                    disabled={editingStatId && isDateDisabled(statsFormData.date)}
                  />
                  {editingStatId && isDateDisabled(statsFormData.date) && (
                    <p className="text-xs text-red-500 mt-1">Past dates cannot be edited</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Tickets</label>
                  <input
                    type="number"
                    name="availableTickets"
                    value={statsFormData.availableTickets}
                    onChange={handleStatsChange}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={editingStatId && isDateDisabled(statsFormData.date)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Booked Tickets</label>
                  <input
                    type="number"
                    name="bookedTickets"
                    value={statsFormData.bookedTickets}
                    onChange={handleStatsChange}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={editingStatId && isDateDisabled(statsFormData.date)}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={editingStatId && isDateDisabled(statsFormData.date)}
                  className={`w-full py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center ${
                    editingStatId && isDateDisabled(statsFormData.date)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                  }`}
                >
                  <Save className="w-5 h-5 mr-2" />
                  {editingStatId ? 'Update Statistics' : 'Save Statistics'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManageMuseums;
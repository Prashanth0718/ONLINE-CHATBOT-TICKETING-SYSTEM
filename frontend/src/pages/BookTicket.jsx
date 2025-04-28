import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { CreditCard, Users, Calendar, Building, Loader } from "lucide-react";

const BookTicket = () => {
  const [museumList, setMuseumList] = useState([]);
  const [museum, setMuseum] = useState("");
  const [location, setLocation] = useState("");
  const [ticketPrice, setTicketPrice] = useState(0);
  const [availableTickets, setAvailableTickets] = useState(0);
  const [date, setDate] = useState("");
  const [visitors, setVisitors] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/museums");
        setMuseumList(data); // Set the fetched museums in state
      } catch (error) {
        console.error("Error fetching museums:", error);
      }
    };

    fetchMuseums();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const handleMuseumChange = (e) => {
    const selectedMuseum = museumList.find(m => m.name === e.target.value);
    setMuseum(selectedMuseum.name);
    setLocation(selectedMuseum.location);
    setTicketPrice(selectedMuseum.ticketPrice);
    setAvailableTickets(selectedMuseum.availableTickets);
  };

  const handlePayment = async () => {
    if (!museum || !date || visitors < 1) {
      alert("⚠️ Please fill in all details before proceeding.");
      return;
    }

    const price = ticketPrice * Number(visitors);
    setLoading(true);

    try {
      let user = {};
      const userFromStorage = localStorage.getItem("user");
      if (userFromStorage) {
        try {
          user = JSON.parse(userFromStorage);
        } catch (err) {
          console.error("Failed to parse user from localStorage:", err);
          user = {};
        }
      }

      const token = localStorage.getItem("token");
      if (!token) {
        alert("⚠️ You are not logged in. Please log in to book a ticket.");
        setLoading(false);
        return;
      }

      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount: price, currency: "INR" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Museum Ticket Booking",
        description: `Booking for ${museum}`,
        order_id: data.orderId,
        handler: async function (response) {
          await axios.post(
            "http://localhost:5000/api/payment/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              museumName: museum,
              date: date,
              price: price,
              visitors: Number(visitors),
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          alert("🎉 Payment & Booking Successful!");
          navigate("/my-tickets");
        },
        prefill: {
          name: user.name || "Guest User",
          email: user.email || "guest@example.com",
          contact: user.phone || "9999999999",
        },
        theme: { color: "#4F46E5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("❌ Payment Error:", error);
      if (error.response) {
        alert(error.response.data?.message || "❌ Payment failed. Please try again.");
      } else if (error.request) {
        alert("❌ No response from server. Please try again.");
      } else {
        alert("❌ Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4"
    >
      <div className="max-w-lg mx-auto">
        <motion.div
          variants={itemVariants}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Book Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Museum Visit
            </span>
          </h1>
          <p className="text-gray-600">
            Select your preferred museum and date to begin your cultural journey.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Museum</label>
            <div className="relative">
              <Building className="absolute left-3 top-3 text-gray-400" />
              <select
                value={museum}
                onChange={handleMuseumChange}
                className="w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              >
                <option value="">Choose a museum</option>
                {museumList.map((museum) => (
                  <option key={museum._id} value={museum.name}>
                    {museum.name} - ₹{museum.ticketPrice} | {museum.location}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Museum Location</label>
            <input
              type="text"
              value={location}
              readOnly
              className="w-full pl-4 pr-4 py-3 bg-gray-100 border rounded-xl focus:outline-none"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Available Tickets</label>
            <input
              type="number"
              value={availableTickets}
              readOnly
              className="w-full pl-4 pr-4 py-3 bg-gray-100 border rounded-xl focus:outline-none"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]} // Ensures today's date or later is selected
                className="w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Number of Visitors</label>
            <div className="relative">
              <Users className="absolute left-3 top-3 text-gray-400" />
              <input
                type="number"
                value={visitors}
                min="1"
                onChange={(e) => setVisitors(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={loading}
              className={`w-full relative overflow-hidden group py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-200"
              }`}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white to-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Payment
                  </>
                )}
              </span>
            </motion.button>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-xs text-center text-gray-500 mt-6"
          >
            By proceeding with the booking, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
              Privacy Policy
            </a>
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookTicket;

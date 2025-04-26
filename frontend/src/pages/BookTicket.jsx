import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const museumPrices = {
  Louvre: 20,
  British: 15,
  Metropolitan: 18,
};

const BookTicket = () => {
  const [museum, setMuseum] = useState("");
  const [date, setDate] = useState("");
  const [visitors, setVisitors] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    console.log("Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY_ID);

    if (!museum || !date || visitors < 1) {
      alert("⚠️ Please fill in all details before proceeding.");
      return;
    }

    const price = museumPrices[museum] * Number(visitors);
    setLoading(true);

    try {
      // ✅ Get logged-in user details
      const user = JSON.parse(localStorage.getItem("user")) || {};
      const token = localStorage.getItem("token");

      if (!token) {
        alert("⚠️ You are not logged in. Please log in to book a ticket.");
        setLoading(false);
        return;
      }

      // ✅ Create Razorpay Order
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
          console.log("✅ Payment Successful:", response);

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
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("❌ Payment Error:", error.response?.data || error.message);
      alert("❌ Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://i0.wp.com/theluxurytravelexpert.com/wp-content/uploads/2020/11/header2.jpg?fit=1300%2C731&ssl=1')",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Booking Form */}
      <div className="relative z-10 bg-white shadow-xl rounded-lg p-8 w-96 animate-fadeIn">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Book a Ticket</h2>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {/* Museum Selection */}
          <div className="relative">
            <select
              value={museum}
              onChange={(e) => setMuseum(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              required
            >
              <option value="">Select a Museum</option>
              {Object.keys(museumPrices).map((museumName) => (
                <option key={museumName} value={museumName}>
                  {museumName} (₹{museumPrices[museumName]})
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            required
          />

          {/* Visitors Selection */}
          <input
            type="number"
            value={visitors}
            min="1"
            onChange={(e) => setVisitors(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            required
          />

          {/* Pay & Book Button */}
          <button
            type="button"
            onClick={handlePayment}
            className={`w-full text-white py-3 rounded-lg text-lg font-semibold shadow-lg transition-all ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay & Book Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookTicket;

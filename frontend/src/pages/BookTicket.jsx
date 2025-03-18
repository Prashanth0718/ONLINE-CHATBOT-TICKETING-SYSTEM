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
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!museum || !date || visitors < 1) {
      alert("Please fill in all details");
      return;
    }
  
    const price = museumPrices[museum] * visitors;
  
    try {
      // ✅ Step 1: Create Razorpay Order
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount: price, currency: "INR" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
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
  
          // ✅ Step 2: Verify Payment & Book Ticket
          await axios.post(
            "http://localhost:5000/api/payment/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              museumName: museum,  // ✅ Ensure museumName is sent
              date: date,  // ✅ Ensure date is sent
              price: price,  // ✅ Ensure price is sent
              visitors: visitors, // ✅ Ensure visitors count is sent
            },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
  
          alert("🎉 Payment & Booking Successful!");
          navigate("/my-tickets");
        },
        prefill: { name: "Your Name", email: "your@email.com", contact: "9999999999" },
        theme: { color: "#3399cc" },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("❌ Payment Error:", error);
      alert("Payment failed. Please try again.");
    }
  };
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Book a Ticket</h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <select
            value={museum}
            onChange={(e) => setMuseum(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a Museum</option>
            <option value="Louvre">Louvre Museum (₹20)</option>
            <option value="British">British Museum (₹15)</option>
            <option value="Metropolitan">Metropolitan Museum (₹18)</option>
          </select>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]} // ⛔ Prevents past dates
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="number"
            value={visitors}
            min="1"
            onChange={(e) => setVisitors(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Pay & Book Ticket
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookTicket;
